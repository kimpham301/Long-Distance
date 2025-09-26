"use client"
import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {ShareIcon} from "lucide-react";
import {SHARE_JOURNAL_MODAL_ID, ShareJournalModal} from "@/components/journal/ShareJournalModal";

const JournalInfo = ({journal, isMobile}: {
    journal: { generated_id: string, last_update: string | null, title: string | null, created_user: string },
    isMobile: boolean
}) => {
    const [shareModal, setShareModal] = useState(false);

    useEffect(() => {
        if(shareModal){
            (document.getElementById(SHARE_JOURNAL_MODAL_ID) as HTMLDialogElement).showModal()
        }
    }, [shareModal]);

    const formattedDate = journal?.last_update ? new Date(journal?.last_update) : undefined

    const closeShareModal = () => {
        setShareModal(false);
    }
    if (isMobile) return null
    return (
        <>
            <div className="flex flex-col gap-2 h-full p-3 pr-0">
                <div>
                    <h6 className={"font-semibold"}>{journal?.title}</h6>
                    <span className={"text-sm text-accent-foreground"}>{formattedDate?.toLocaleString("en-US", {
                        year: 'numeric',
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}</span>
                </div>
                <div className={"flex-grow"}></div>
                <div className={"p-2 flex gap-2 flex-row-reverse"}>
                    <Button variant={"secondary"} onClick={() => {
                        setShareModal(true);
                    }}>
                        <ShareIcon/>
                    </Button>
                </div>
            </div>
            <hr className={"border-border h-full"} style={{borderWidth: "0.5px"}}/>
            {shareModal && <ShareJournalModal journal={{journalId: journal.generated_id, title: journal.title ?? ""}} userId={journal?.created_user} closeModal={closeShareModal}/>}
        </>
    );
};

export default JournalInfo;