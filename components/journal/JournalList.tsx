"use client"
import React from 'react';
import JournalCard from './JournalCard';
import {Button} from "@/components/ui/button";
import {Card, CardHeader} from "@/components/ui/card";
import {PlusIcon} from "lucide-react";
import useCreateJournal from "@/hooks/useCreateJournal";
import {CREATE_JOURNAL_MODAL_ID, CreateJournalModal} from "@/components/journal/modal/CreateJournalModal";
import {Snackbar} from "@/components/ui/Snackbar";

const JournalList = ({userId, journal}:{userId?: string, journal?: {generated_id: string, title: string | null }[]}) => {
    const {optimisticJournals,
        snackbar,
        handleSnackbarAction,
        createJournalFormAction} = useCreateJournal(userId, journal)

    return (
        <div className={"flex flex-wrap flex-col md:flex-row gap-4"}>
            {optimisticJournals?.map((journal, index) => {
                if(journal.generated_id === optimisticJournals[index-1]?.generated_id){
                    return null
                }
                return (
                    <JournalCard key={journal?.generated_id} journal={journal}/>)
            })}
                <Button variant={"ghost"} className={'w-full h-full p-0 md:w-56 md:h-40'} onClick={() =>  {
                    (document.getElementById(CREATE_JOURNAL_MODAL_ID) as HTMLDialogElement).showModal();}}>
                    <Card className={"w-full h-full content-center justify-center bg-muted"}>
                        <CardHeader className={"flex items-center gap-2 font-bold"}>
                            <PlusIcon className={"w-24 h-24"}/> New journal
                        </CardHeader>
                    </Card>
                </Button>
                <CreateJournalModal handleFormAction={createJournalFormAction} />
            {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} onClose={() => handleSnackbarAction("", null)} />}

        </div>
    );
};

export default JournalList;