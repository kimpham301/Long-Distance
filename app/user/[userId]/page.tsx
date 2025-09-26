import React from 'react';
import {createClient} from "@/lib/supabase/server";

export default async function UserProfilePage  ({params}:{params: Promise<{userId: string}>}){
    const supabase = await createClient()
    const {userId} = await params;
    const {data: userProfiles, error} = await supabase.from("profiles").select("username, email").eq('id', userId).single()
    if(error){
        console.error('Cannot find user user')
        return null
    }
    return (
        <main className={"flex justify-center"}>
            <div>{userProfiles.username || userProfiles.email}</div>
        </main>
    );
};