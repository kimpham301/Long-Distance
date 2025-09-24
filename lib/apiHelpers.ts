"use server";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";

export async function  insertJournal(entry: {journal_id: string, content: string}){
    const supabase = await createClient();
    const {data: user, error: userError} = await supabase.auth.getUser()
    if(!user?.user || userError){
        console.log("Can't find user")
        return null;
    }
    else {
        console.log({...entry, user_id: user.user?.id})
        const {data, error} = await supabase
            .from('journal_history')
            .insert({...entry, user_id: user.user?.id})
            .select("content, created_at, profiles(username)")
        if(error){
            console.log("Error adding new entry:", error)
            return null
        }
        revalidatePath("/journal");
        return data
    }

}