"use client"
import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {BookHeart} from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import {User} from "@supabase/auth-js";
import JournalPicker from "@/components/journal/JournalPicker";
import {useParams} from "next/navigation";
import {getJournal} from "@/lib/serverHelpers";
import JournalInfo, {JournalInfoType} from "@/components/journal/JournalInfo";

const JournalInfoDrawer = ({user}: {user: User | null}) => {
    const [open, setOpen] = React.useState(false);
    const [journalInfo, setJournalInfo] = React.useState<JournalInfoType | null>(null);
    const params = useParams<{journalId: string}>();

    useEffect(() => {
        getJournal(params.journalId).then((d) => {
            if (d){
            setJournalInfo(d)
        }})
    },[params.journalId])

    return (
        <>
            <Button variant={"ghost"} onClick={() => {setOpen(!open);}} className={"[&_svg]:size-5"}>
                <BookHeart/>
            </Button>
            <Drawer direction={"left"} open={open} handleClose={() => setOpen(false)} width={"w-2/3"} className={"pt-0"}>
                <JournalPicker currentUser={user?.id} />
                {journalInfo && <div className={"h-full pr-2"}>
                    <JournalInfo journal={journalInfo} isUserCreator={journalInfo?.created_user === user?.id} /></div>}
            </Drawer>
        </>
    );
};

export default JournalInfoDrawer;