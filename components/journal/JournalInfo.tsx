"use client"
import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {ShareIcon, UserRoundIcon} from "lucide-react";
import {SHARE_JOURNAL_MODAL_ID, ShareJournalModal} from "@/components/journal/ShareJournalModal";
import Image from "next/image";
import {clsx} from "clsx";
import Link from "next/link";

const JournalInfo = ({journal, isMobile, userMap}: {
    journal: { generated_id: string, last_update: string | null, title: string | null, created_user: string },
    isMobile: boolean,
    userMap: Map<string, {id: string,name: string, color: string, avatar_url: string}>
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
    const userArr = Array.from(userMap.values())
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
                <div className={"flex-grow"}>
                    <div className={"flex items-center"}>
                        {userArr.map((user, index) => {
                            return (
                                <Fragment key={user.id}>
                                    <Link href={"/user/" + user.id}>
                                <span
                                      className={clsx("rounded-full w-20 h-20 flex shrink-0", `bg-${user.color}`)}>
                                {user.avatar_url
                                    ? (<Image className={clsx("aspect-square h-full w-full rounded-full border-4",`border-${user.color}`)}
                                              src={user.avatar_url}
                                              width={100}
                                              height={100}
                                              alt={user.name ?? ""}
                                        />
                                    )
                                    : <UserRoundIcon className={'m-auto w-12 h-12'}/>}
                        </span>
                                    </Link>
                                {index < userArr.length - 1 && (
                                    <div
                                        className="h-0.5 w-full bg-striped"></div>)}</Fragment>)
                        })}
                    </div>
                </div>
                <div className={"p-2 flex gap-2 flex-row-reverse"}>
                    <Button variant={"secondary"} onClick={() => {
                        setShareModal(true);
                    }}>
                        <ShareIcon/>
                    </Button>
                </div>
            </div>
            <hr className={"border-border h-full"} style={{borderWidth: "0.5px"}}/>
            {shareModal && <ShareJournalModal journal={{journalId: journal.generated_id, title: journal.title ?? ""}}
                                              userId={journal?.created_user} closeModal={closeShareModal}/>}
        </>
    );
};

export default JournalInfo;