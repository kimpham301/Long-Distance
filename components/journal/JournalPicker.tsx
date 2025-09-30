"use client"
import React, {useEffect, useState, useTransition} from 'react';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {createClient} from "@/lib/supabase/client";
import {useParams, useRouter} from "next/navigation";
import {ChevronDown, PlusIcon} from "lucide-react";
import Loading from "@/components/ui/Loading";
import {CreateJournalModal, CREATE_JOURNAL_MODAL_ID} from "@/components/journal/modal/CreateJournalModal";
import {Snackbar} from "@/components/ui/Snackbar";

const JournalPicker = ({currentUser}: { currentUser: string | undefined }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition()

    const supabase = createClient()
    const params = useParams<{ journalId: string }>()
    const [journals, setJournals] = useState<{ generated_id: string, title: string | null, default: boolean }[]>([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState<{message: string, type: "success" | "error"} | null>();

    const handleOpenCreateModal = () => {
        (document.getElementById(CREATE_JOURNAL_MODAL_ID) as HTMLDialogElement).showModal();
    }

    const [optimisticJournals, addOptimisticJournals] = React.useOptimistic(journals, (state, newJournal: {
        title: string,
        generated_id: string
    }) =>
        [...state,
            {
                title: newJournal.title,
                default: false,
                generated_id: newJournal.generated_id,
                status: "pending"
            }]);

    useEffect(() => {
        setLoading(true);

        if (currentUser) {
            supabase.from("user_journal_access").select("journal_id, is_default, journal(title)").eq("user_id", currentUser).then((data) => {
                setLoading(false)
                return data?.data || !data?.error
                    ? setJournals(data.data?.map((journal) => ({generated_id: journal.journal_id, default: journal.is_default, title: journal.journal.title })))
                    : setJournals([])
            })
        }

    }, [supabase, currentUser])

    const createJournalFormAction= async (formData: FormData ) => {
        const newTitle = (formData.get("title") || "") as string;
        const generated_id = `${newTitle.split(' ').map(c => c.at(0)).join("")}-${Date.now()}-${currentUser?.split('-')[0]}`
        if (newTitle.trim()) {
            addOptimisticJournals({title: newTitle, generated_id: generated_id});
            const {data: journalReturn, error} = await supabase.from("journal")
                .insert({title: newTitle, generated_id: generated_id, created_user: currentUser})
                .select("title, default, generated_id")
                .limit(1)
                .single()
            if (journalReturn || !error) {
                setJournals([...journals, journalReturn]);
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

    const handleChangeJournal = (journalId: string) => {
        startTransition(() => {
            router.push(`/journal/${journalId}`)
        })
    }
    if (!params?.journalId) {
        return null
    }
    if (loading) {
        return <Loading className={"top-5"}/>
    }


    return (
        <>
            {isPending && <Loading className={"top-5"} />}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={isPending}>
                        {journals.find(journal => journal.generated_id === params?.journalId)?.title}
                        <ChevronDown/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-content" align="center">
                    <DropdownMenuRadioGroup
                        value={params.journalId}
                        onValueChange={(e) => handleChangeJournal(e)}
                    >
                        {optimisticJournals.map((journal) => (
                            <DropdownMenuRadioItem key={journal.generated_id}
                                                   value={journal.generated_id}><span>{journal.title}</span></DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                    <DropdownMenuItem onClick={handleOpenCreateModal} className={"text-primary"}><PlusIcon
                        className={"size-4"}/> New Journal</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <CreateJournalModal handleFormAction={createJournalFormAction}/>
            {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar(null)} />}
        </>
    );
};

export default JournalPicker;