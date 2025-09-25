import React from 'react';
import {createClient} from "@/lib/supabase/server";

const UserProfilePage = async ({params}:{params: {userId: string}}) => {
    const supabase = await createClient()
    const {data: userProfiles, error} = await supabase.from("profiles").select("username, email").eq('id', params?.userId).single()
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

export default UserProfilePage;