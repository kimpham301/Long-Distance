import React from 'react';
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {Card, CardHeader} from "@/components/ui/card";
import InviteSuccessCard from "@/components/InviteSuccessCard";

export default async function InvitePage ({params}: {params: Promise<{inviteId: string}>}) {
    const supabase = await createClient()
    const {data: authData} = await supabase.auth.getUser();
    const user = authData?.user
    const {inviteId} = await params
    const {data: validateInvite, error} = await supabase.from("invites").select("id, invite_code, title, user_invite, is_used, journal(generated_id)").eq("invite_code", inviteId).limit(1).single();

    if(error){
        redirect("/auth/error")
    }

    if(validateInvite.is_used || !validateInvite){
        return (
            <Card>
                <CardHeader>
                    The link is expired
                </CardHeader>
            </Card>
        );
    }
    else if(user?.id) {
        if(user.id === validateInvite.user_invite){
            redirect(`/journal`);
        }
        const updateReq = {
            is_used: true,
            user_receive_invite: user?.id ?? null
        }
        await supabase.from("invites").update(updateReq).eq("id", validateInvite.id)
            return (
                <InviteSuccessCard isUserLogin journalTitle={validateInvite.title ?? ""}/>
            )
    }
    else{
        return (
            <InviteSuccessCard isUserLogin={false} inviteCode={validateInvite.invite_code} journalTitle={validateInvite.title ?? ""} />
        );
    }

};