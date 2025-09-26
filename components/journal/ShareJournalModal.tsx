"use client"
import React from 'react';
import Modal from "@/components/ui/Modal";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { XIcon} from "lucide-react";
import JournalLinkShare from "@/components/journal/JournalLinkShare";

const SHARE_JOURNAL_MODAL_ID = "share-journal-modal";
const ShareJournalModal = ({journalId, userId, closeModal} : {journalId: string, userId: string, closeModal: () => void}) => {
    return (
        <Modal id={SHARE_JOURNAL_MODAL_ID}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Share your journal</CardTitle>
                    <CardDescription>
                        The person you share your journal would be able to read and write in your journal.
                    </CardDescription>
                    <Button variant={"ghost"}
                            onClick={() => {
                                (document.getElementById(SHARE_JOURNAL_MODAL_ID)as HTMLDialogElement).close();
                                closeModal();
                            }}
                            className={"absolute right-4 top-2"}
                    >
                        <XIcon/>
                    </Button>
                </CardHeader>
                <CardContent>
                       <JournalLinkShare journalId={journalId} userId={userId} />
                </CardContent>
            </Card>
        </Modal>
    );
};

export {ShareJournalModal, SHARE_JOURNAL_MODAL_ID};