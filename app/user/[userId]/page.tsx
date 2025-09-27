import React from 'react';
import {createClient} from "@/lib/supabase/server";
import { UserRoundIcon} from "lucide-react";
import UserDisplayNameEditor from "@/components/user/UserDisplayNameEditor";
import Image from "next/image";

export default async function UserProfilePage  ({params}:{params: Promise<{userId: string}>}){
    const supabase = await createClient()
    const {userId} = await params;
    const {data: userProfiles, error} = await supabase.from("profiles").select("username, email, avatar_url").eq('id', userId).single()
    if(error){
        console.error('Cannot find user user')
        return null
    }
    const getInitials = (name: string | null) => {
        return name ? name.split(' ').map(name => name[0]).join('') : "N/A";
    }
    return (
        <div className={"flex h-full justify-center items-center flex-col gap-8"}>
            <span className={"rounded-full bg-muted w-20 h-20 relative flex shrink-0"}>{userProfiles?.avatar_url
                ? <Image className={"aspect-square h-full w-full"}
                       src={userProfiles.avatar_url}
                       alt={getInitials(userProfiles.username)} />
                : <UserRoundIcon className={'m-auto w-10 h-10'}/>}</span>
            <div className={'py-4 px-8 rounded-lg border-border border-2 bg-secondary sm:w-full md:w-1/3'}>
                <ul className={"flex justify-between"}>
                    <li className={"flex flex-col gap-6 self-end"}>
                        <p >Display Name </p>
                        <p>
                            Email
                        </p>
                    </li>
                    <li className={"flex flex-col items-end gap-4"}>
                       <UserDisplayNameEditor userProfiles={userProfiles} userId={userId} />
                        <p>
                            {userProfiles.email}
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
};