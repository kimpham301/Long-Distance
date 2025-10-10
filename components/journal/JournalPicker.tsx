"use client"
import React, {useTransition} from 'react';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useParams, useRouter} from "next/navigation";
import {ChevronDown, PlusIcon} from "lucide-react";
import Loading from "@/components/ui/Loading";
import {CreateJournalModal, CREATE_JOURNAL_MODAL_ID} from "@/components/journal/modal/CreateJournalModal";
import {Snackbar} from "@/components/ui/Snackbar";
import useCreateJournal from "@/hooks/useCreateJournal";

const JournalPicker = ({currentUser}: { currentUser?: string }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition()

    const params = useParams<{ journalId: string }>()

    const handleOpenCreateModal = () => {
        (document.getElementById(CREATE_JOURNAL_MODAL_ID) as HTMLDialogElement).showModal();
    }
    const {loading,
        journals,
        optimisticJournals,
        createJournalFormAction,
        snackbar,
        handleSnackbarAction} = useCreateJournal(currentUser)

    const handleChangeJournal = (journalId: string) => {
        startTransition(() => {
            router.push(`/journal/${journalId}`)
        })
    }
    if (!params?.journalId) {
        return null
    }
    if (loading) {
        return <div className={"w-24 bg-muted rounded-md h-9 animate-pulse"}/>
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
            {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} onClose={() => handleSnackbarAction("", null)} />}
        </>
    );
};

export default JournalPicker;