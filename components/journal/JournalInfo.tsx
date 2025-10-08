"use client"
import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {SettingsIcon, ShareIcon, UserRoundIcon} from "lucide-react";
import {SHARE_JOURNAL_MODAL_ID, ShareJournalModal} from "@/components/journal/modal/ShareJournalModal";
import Image from "next/image";
import Link from "next/link";
import {SETTINGS_JOURNAL_MODAL_ID, SettingsModal} from "@/components/journal/modal/SettingsModals";
import {Tables} from "@/database.types";

export type UserPrefWithProfile = Pick<Tables<'journal_user_preference'>, 'color' | 'display_name'> & {profiles: Tables<'profiles'>}
export type JournalInfoType  = 
    Omit<Tables<'journal'>, 'id' | 'default' | 'created_at'> 
    & {journal_user_preference: UserPrefWithProfile[]}
const JournalInfo = ({journal, isMobile, isUserCreator}: {
    journal: JournalInfoType | null,
    isMobile?: boolean,
    isUserCreator: boolean
}) => {
    const [shareModal, setShareModal] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);

    useEffect(() => {
        if(shareModal){
            (document.getElementById(SHARE_JOURNAL_MODAL_ID) as HTMLDialogElement).showModal()
        }
        if(settingsModal){
            (document.getElementById(SETTINGS_JOURNAL_MODAL_ID) as HTMLDialogElement).showModal()
        }
    }, [shareModal, settingsModal]);

    const closeShareModal = () => {
        setShareModal(false);
    }
    const closeSettingsModal = () => {
        setSettingsModal(false);
    }
    const userArr = journal?.journal_user_preference ?? []
    const distanceDate = journal?.long_distance_date ? new Date(journal.long_distance_date) : null;

    const getDateDiff = () => {
        const _MS_PER_DAY = 1000*60*60*24
        if(!distanceDate)
            return null;
        const now = new Date();
        // @ts-expect-error works
        const diff = Math.floor((now - distanceDate)/_MS_PER_DAY);
        return diff === 0 ? null : diff;
    }
    if (isMobile || !journal) return null
    return (
        <>
            <div className="flex flex-col gap-2 h-full p-3 pr-0 md:min-w-[222px]">
                <h6 className={"font-semibold"}>Relationship info</h6>
                <div className={"flex-grow flex flex-col gap-3"}>
                    <div className={"flex items-center"}>
                        {userArr.map((user, index) => {
                            const bgColor = "bg-"+ user.color
                            return (
                                <Fragment key={user.profiles.id}>
                                    <Link href={"/user/" + user.profiles.id}>
                                <span
                                      className={`rounded-full w-20 h-20 flex shrink-0 ${bgColor} p-1`}>
                                {user.profiles.avatar_url
                                    ? (<Image className={`aspect-square h-full w-full rounded-full`}
                                              src={user.profiles.avatar_url}
                                              width={100}
                                              height={100}
                                              alt={user.profiles.username ?? ""}
                                        />
                                    )
                                    : <UserRoundIcon className={'m-auto w-12 h-12'}/>}
                        </span>
                                    </Link>
                                {index < userArr.length - 1 && (
                                    <div
                                        className="h-0.5 w-full bg-striped"></div>)}</Fragment>)
                        })}
                        {userArr.length === 1 &&
                            (<>
                            <div className="h-0.5 w-full bg-striped"></div>
                            <Button
                                onClick={() => setShareModal(true)}
                            className={`rounded-full w-20 h-20 flex justify-center items-center text-2xl font-bold shrink-0 bg-muted text-muted-foreground p-1`}>
                                ?
                            </Button>
                            </>
                            )
                        }
                    </div>

                    {distanceDate && <div className={"rounded-2xl text flex flex-col items-center"}>
                        <span className={"text-[14px]"}>Distanced since</span>
                        <span className={"text-primary font-semibold"}>
                            {distanceDate.toLocaleDateString()} <span className={"text-xs text-muted-foreground"}>({getDateDiff() + " days)"}</span>
                        </span>
                    </div>}
                </div>
                <div className={"p-2 flex gap-2 flex-row-reverse"}>
                    <Button variant={"secondary"} onClick={() => {
                        setShareModal(true);
                    }}>
                        <ShareIcon/>
                    </Button>
                    <Button variant={"secondary"} onClick={() => {setSettingsModal(true)}}>
                        <SettingsIcon />
                    </Button>
                </div>
            </div>
            {shareModal && <ShareJournalModal journal={{journalId: journal.generated_id, title: journal.title ?? ""}}
                                              userId={journal?.created_user} closeModal={closeShareModal}/>}
            {settingsModal && <SettingsModal journal={journal} closeModal={closeSettingsModal} isUserCreator={isUserCreator} />}
        </>
    );
};

export default JournalInfo;