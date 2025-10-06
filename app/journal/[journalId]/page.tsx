import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JournalInput from "@/components/journal/JournalInput";
import JournalEntry from "@/components/journal/JournalEntry";
import JournalInfo from "@/components/journal/JournalInfo";
import {Fragment} from "react";
import {isMobileView} from "@/lib/serverHelpers";
import {FrownIcon} from "lucide-react";

const USER_COLOR = ['bg-primary','bg-orange-400','bg-emerald-700']
export default async function JournalPage({params}: {params: Promise<{journalId: string}>}) {
    const supabase = await createClient();
    const {journalId} =  await params
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }
    const {data: journal, error: journalError} = await supabase.from("journal")
        .select(`generated_id, last_update, created_user, profiles(username, email, avatar_url), title, long_distance_date, entries:journal_history(*, profiles(id,username, email, avatar_url))`)
        .eq("generated_id", journalId)
        .order('created_at', { ascending: false, referencedTable: "entries"}).single();
    if (journalError) {
        redirect("/")
    }
    const isMobile = await isMobileView();
    const userMap = new Map();
    userMap.set(journal.profiles.email, {
        id: journal?.created_user,
        avatar_url: journal?.profiles.avatar_url,
        color: USER_COLOR[0],
        name: journal?.profiles.username})
    const userColorWithoutCreator = USER_COLOR.slice(1);
    const isUserCreator = journal.created_user === data.claims.sub
    return (
        <div className="flex-1 w-full flex gap-8 h-full">
            <JournalInfo journal={journal}  isMobile={isMobile} userMap={userMap} isUserCreator={isUserCreator}/>
            <div className="flex flex-col flex-grow gap-2 bg-secondary h-full rounded-sm p-3">
                <JournalInput journalId={journal?.generated_id}/>
                <div className={"flex flex-col h-full overflow-auto p-3"}>
                    {journal?.entries.length  === 0 && <div className={"flex text-muted-foreground flex-col gap-2 h-full items-center justify-center"}>
                        <FrownIcon className={"w-20 h-20"} />
                        <p>This journal has no entry</p>
                    </div>}
                    {journal?.entries?.map((entry, index) => {
                        let count = 0
                        const entryDate = new Date(entry?.created_at)
                        if(!userMap.has(entry?.profiles.email)){
                            userMap.set(entry?.profiles.email, {
                                id: entry?.profiles.id,
                                avatar_url: entry?.profiles.avatar_url,
                                color: userColorWithoutCreator[count],
                                name: entry?.profiles.username}
                            )
                            count++
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
