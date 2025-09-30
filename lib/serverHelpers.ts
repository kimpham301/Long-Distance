"use server";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {headers} from "next/headers";
import {userAgentFromString} from "next/server";

export async function isMobileView(){
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");
    const { device } = userAgentFromString(userAgent || '');
    return device.type === 'mobile';
}

export async function  insertJournal(entry: {journal_id: string, content: string}){
    const supabase = await createClient();
    const {data: user, error: userError} = await supabase.auth.getUser()
    if(!user?.user || userError){
        console.error("Can't find user")
        return null;
    }
    else {
        const {data, error} = await supabase
            .from('journal_history')
            .insert({...entry, user_id: user.user?.id})
            .select("content, created_at, profiles(username)")
        if(error){
            console.error("Error adding new entry:", error)
            return null
        }
        revalidatePath("/journal");
        return data
    }
}

export async function updateJournal(journal_id: string, request: {title: string, long_distance_date: string}){
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("journal")
        .update({...request, last_update: new Date().toLocaleString()})
        .eq("generated_id", journal_id)
        .select("title, long_distance_date, last_update")
    if(error){
        console.error("Error updating journal", error)
        return null
    }
    else{
        revalidatePath(`/journal/${journal_id}`);
        return data
    }
}

export async function deleteJournal(journal_id: string){
    const supabase = await createClient();
    const {error} = await supabase
        .from("journal")
        .delete()
        .eq("generated_id", journal_id)
    if(error){
        console.error("Error deleting journal", error)
        return null
    }
    else{
        revalidatePath(`/journal/${journal_id}`);
        return "deleted"
    }
}