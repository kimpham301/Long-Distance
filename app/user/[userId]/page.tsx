import React from 'react';
import {createClient} from "@/lib/supabase/server";
import UserDisplayNameEditor from "@/components/user/UserDisplayNameEditor";
import UserAvatar from "@/components/user/UserAvatar";
import {UserContextWrapper} from "@/components/UserContextWrapper";

export default async function UserProfilePage  ({params}:{params: Promise<{userId: string}>}){
    const supabase = await createClient()
    const {userId} = await params;
    const {data: userProfiles, error} = await supabase.from("profiles").select("username, email, avatar_url").eq('id', userId).single()
    if(error){
        console.error('Cannot find user user')
        return null
    }

    return (
        <UserContextWrapper userId={userId} existingProfile={userProfiles}>
        <div className={"flex h-full justify-center items-center flex-col gap-8"}>
           <UserAvatar userProfiles={userProfiles} />
            <div className={'py-4 px-8 rounded-lg border-border border-2 bg-secondary md:min-w-[420px]'}>
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
        </UserContextWrapper>
    );
};
