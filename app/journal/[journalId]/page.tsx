import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JournalInput from "@/components/journal/JournalInput";
import JournalEntry from "@/components/journal/JournalEntry";
import JournalInfo from "@/components/journal/JournalInfo";
import {Fragment} from "react";
import {isMobileView} from "@/lib/serverHelpers";

const USER_COLOR = ['primary','[#9065b0]', '[#d9730d]' ]
export default async function JournalPage({params}: {params: Promise<{journalId: string}>}) {
    const supabase = await createClient();
    const {journalId} =  await params
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }
    const {data: journal, error: journalError} = await supabase.from("journal")
        .select(`generated_id, last_update, created_user, title, entries:journal_history(*, profiles(id,username, email, avatar_url))`)
        .eq("generated_id", journalId)
        .order('created_at', { ascending: false, referencedTable: "entries"}).single();
    if (journalError) {
        redirect("/")
    }
    const isMobile = await isMobileView();
    const userMap = new Map();
    return (
        <div className="flex-1 w-full flex gap-8 h-full">
            <JournalInfo journal={journal}  isMobile={isMobile} userMap={userMap}/>
            <div className="flex flex-col flex-grow gap-2 bg-secondary h-full rounded-sm p-3">
                <JournalInput journalId={journal?.generated_id}/>
                <div className={"flex flex-col h-full overflow-auto p-3"}>
                    {journal?.entries?.map((entry, index) => {
                        const entryDate = new Date(entry?.created_at)
                        if(!userMap.has(entry?.profiles.email)){
                            userMap.set(entry?.profiles.email, {
                                id: entry?.profiles.id,
                                avatar_url: entry?.profiles.avatar_url,
                                color: USER_COLOR[index%2],
                                name: entry?.profiles.username}
                            )
                        }
                        return (<Fragment key={entry?.id}>
                            <JournalEntry userName={entry?.profiles?.username ?? entry?.profiles.email?.split("@")[0] ?? "N/A"}
                                          userColor={userMap.get(entry?.profiles?.email).color ?? USER_COLOR[0]}
                                          entryDate={entryDate.toLocaleString()}
                                          content={entry?.content ?? ""}/>{index < journal?.entries?.length -1
                            && <hr  />}
                        </Fragment>)})}
                </div>
            </div>

        </div>
    );
}
