"use client"
import React from 'react';
import {Button} from "@/components/ui/button";
import {BookHeart} from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import {User} from "@supabase/auth-js";
import JournalPicker from "@/components/journal/JournalPicker";
import JournalInfo from "@/components/journal/JournalInfo";

const JournalInfoDrawer = ({user}: {user: User | null}) => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Button variant={"ghost"} onClick={() => {setOpen(!open);}} className={"[&_svg]:size-5"}>
                <BookHeart/>
            </Button>
            <Drawer direction={"left"} open={open} handleClose={() => setOpen(false)} width={"w-2/3"} className={"pt-0"}>
                <JournalPicker currentUser={user?.id} />
                {user?.id && <div className={"h-full pr-2"}>
                    <JournalInfo currentUser={user?.id}/></div>}
            </Drawer>
        </>
    );
};

export default JournalInfoDrawer;