import React, {useEffect, useState} from 'react';
import {CREATE_JOURNAL_MODAL_ID} from "@/components/journal/modal/CreateJournalModal";
import {createClient} from "@/lib/supabase/client";
import {useParams} from "next/navigation";

const useCreateJournal = (
    currentUserId: string | undefined,
    exJournal?: { generated_id: string, title: string | null }[]) => {
    const supabase = createClient()
    const params = useParams<{journalId: string}>()
    const [loading, setLoading] = useState(true);
    const [journals, setJournals] = useState<{ generated_id: string, title: string | null }[]>( exJournal ?? []);
    const [snackbar, setSnackbar] = useState<{message: string, type: "success" | "error"} | null>();

    const [optimisticJournals, addOptimisticJournals] = React.useOptimistic(journals, (state, newJournal: {
        title: string,
        generated_id: string
    }) =>
        [...state,
            {
                title: newJournal.title,
                default: false,
                generated_id: newJournal.generated_id,
                pending: true
            }]);

    useEffect(() => {
        setLoading(true);
console.log("render")
        if (currentUserId && !exJournal) {
            supabase.from("user_journal_access").select("journal_id, is_default, journal(title)").eq("user_id", currentUserId).then((data) => {
                setLoading(false)
                return data?.data || !data?.error
                    ? setJournals(data.data?.map((journal) => ({generated_id: journal.journal_id, default: journal.is_default, title: journal.journal.title })))
                    : setJournals([])
            })
        }

    }, [supabase, currentUserId, exJournal, params.journalId])

    const createJournalFormAction= async (formData: FormData ) => {
        const newTitle = (formData.get("title") || "") as string;
        const generated_id = `${newTitle.split(' ').map(c => c.at(0)).join("")}-${Date.now()}-${currentUserId?.split('-')[0]}`
        if (newTitle.trim()) {
            addOptimisticJournals({title: newTitle, generated_id: generated_id});
            const {data: journalReturn, error} = await supabase.from("journal")
                .insert({title: newTitle, generated_id: generated_id, created_user: currentUserId})
                .select("title, default, generated_id, created_user")
                .limit(1)
                .single()
            if (journalReturn || !error) {
                await supabase.from("journal_user_preference").upsert({journal_id: journalReturn.generated_id, color: "primary", user_id: journalReturn.created_user })
                setJournals((prev) => [...prev, journalReturn]);
                (document.getElementById(CREATE_JOURNAL_MODAL_ID)as HTMLDialogElement).close()
                handleSnackbarAction( "New journal created", "success")
            }
            else{
                handleSnackbarAction("Error creating new journal", "error");

            }
        }
    }

    const handleSnackbarAction= async (message: string, type: 'success' | 'error' | null) => {
        if(type){
            setSnackbar({message: message, type: type});
        }
        else setSnackbar(null)
    }

    return {
        loading,
        journals,
        optimisticJournals,
        createJournalFormAction,
        snackbar,
        handleSnackbarAction

    }
};

export default useCreateJournal;