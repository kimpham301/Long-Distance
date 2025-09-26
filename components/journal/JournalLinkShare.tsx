"use client"
import React, {useEffect, useState} from 'react';
import Loading from "@/components/ui/Loading";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CheckIcon} from "lucide-react";
import {createClient} from "@/lib/supabase/client";

const JournalLinkShare = ({journal, userId} : {journal: { journalId: string, title: string }, userId: string}) => {
    const supabase= createClient()

    const [copySuccess, setCopySuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const [inviteCode, setInviteCode] = useState("");

    const baseUrl = window.location.origin+"/invite/"

    useEffect(() => {
        supabase.from("invites").select("invite_code, is_used").eq("is_used", false).then((d) => {
            if(d.error){
                console.log(d.error);
                setLoading(false);
            }
            else if (d.data.length > 0){
                setInviteCode(baseUrl+d.data[0].invite_code)
                setLoading(false);
            }
            else {
                supabase.from("invites").insert({journal: journal.journalId, user_invite: userId, title: journal.title}).select("invite_code").single()
                    .then((d) => {if(d.data && !d.error) {
                        setInviteCode(d.data?.invite_code ?baseUrl+d.data?.invite_code : "")
                    }
                    else{
                        console.error(d.error)
                    }
                        setLoading(false);

                    })
            }
        })

    }, [supabase, journal, userId, baseUrl]);

    const copyClipboard = () => {
        navigator.clipboard.writeText(inviteCode).then(() => setCopySuccess(true));

    }
    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-2">
                {loading && <Loading/>}
                <Input
                    readOnly
                    disabled
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Name of your journal..."
                    required
                    value={inviteCode}
                />
            </div>
            <Button className={copySuccess ? "bg-success" : ""} disabled={!inviteCode} onClick={copyClipboard}>
                {copySuccess && <CheckIcon/>}
                {copySuccess ? "Copied to clipboard" : "Copy"}
            </Button>
        </div>
    );
};

export default JournalLinkShare;