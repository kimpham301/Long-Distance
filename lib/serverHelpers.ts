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

export async function  getJournal(journalId: string) {
    const supabase = await createClient();
    const {data: journal, error: journalError} = await supabase.from("journal")
        .select(`generated_id, last_update, created_user, title, long_distance_date ,user_journal_access(is_default), journal_user_preference(color,display_name, profiles(*))`)
        .eq("generated_id", journalId)
        .single();
    if (journalError) {
        return null
    }
    return journal;
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
            .select("*, profiles(username, email)")
            .single()
        if(error){
            console.error("Error adding new entry:", error)
            return null
        }
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
export async function getTotalEntries(journal_id: string){
    const supabase = await createClient();

    const {count, error: countError} = await supabase.from("journal_history")
        .select('*', {count: "exact", head: true})
        .eq('journal_id', journal_id)
    if(countError)
    {
        return 0
    }
    else return count
}
export async function getJournalEntry(journalId: string, gte: string, lte: string) {
    const supabase = await createClient();
    const {data: entries, error : entriesError} = await supabase.from("journal_history")
        .select('*, entries_history(content, created_at), profiles(id,username, email, avatar_url)')
        .eq("journal_id", journalId)
        .order('created_at', { ascending: false})
        .gte('created_at', gte)
        .lte('created_at', lte)
    if(entriesError){
        return []
    }
    else {
        return entries
    }
}
export async function updateJournalEntry(entry: {id: number | undefined, content: string}){
    const supabase = await createClient();
    const {data: user, error: userError} = await supabase.auth.getUser()
    if(!user?.user || userError || !entry.id){
        console.error("Can't find user")
        return null;
    }
    else {
        const {data, error} = await supabase
            .from('journal_history')
            .update({content: entry.content, user_id: user.user?.id, updated_at: new Date().toLocaleString()})
            .eq("id", entry.id )
            .select("content, created_at, profiles(username)")
        if(error){
            console.error("Error update entry:", error)
            return null
        }
        revalidatePath("/journal");
        return data
    }
}