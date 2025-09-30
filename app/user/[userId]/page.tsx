import React from 'react';
import {createClient} from "@/lib/supabase/server";
import UserDisplayNameEditor from "@/components/user/UserDisplayNameEditor";
import UserAvatar from "@/components/user/UserAvatar";
import {UserContextWrapper} from "@/components/UserContextWrapper";
import {redirect} from "next/navigation";

export default async function UserProfilePage  ({params}:{params: Promise<{userId: string}>}){
    const supabase = await createClient()
    const {data: authUser, error: authError} = await supabase.auth.getUser()

    const {userId} = await params;
    if(authError){
        redirect("/auth/error")
    }
    const {data: userProfiles, error} = await supabase.from("profiles").select("id, username, email, avatar_url").eq('id', userId).single()
    if(error){
        console.error('Cannot find user user')
        return null
    }

    return (
        <UserContextWrapper userId={authUser.user?.id} existingProfile={userProfiles}>
        <div className={"flex h-full justify-center items-center flex-col gap-8"}>
           <UserAvatar  />
            <div className={'py-4 px-8 rounded-lg border-border border-2 bg-secondary md:min-w-[420px]'}>
                <ul className={"flex justify-between"}>
                    <li className={"flex flex-col gap-5"}>
                        <p >Display Name </p>
                        <p>
                            Email
                        </p>
                    </li>
                    <li className={"flex flex-col items-end gap-5"}>
                       <UserDisplayNameEditor />
                        <p>
                            {userProfiles.email}
                        </p>
                    </li>
                </ul>
            </div>
        </div>
        </UserContextWrapper>
    );
};
