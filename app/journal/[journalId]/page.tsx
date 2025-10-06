import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JournalInput from "@/components/journal/JournalInput";
import JournalEntry from "@/components/journal/JournalEntry";
import JournalInfo from "@/components/journal/JournalInfo";
import {Fragment} from "react";
import {getJournalEntry, isMobileView} from "@/lib/serverHelpers";
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
        .select(`generated_id, last_update, created_user, profiles(username, email, avatar_url), title, long_distance_date, journal_history(count), user_journal_access(*)`)
        .eq("generated_id", journalId)
        .single();
    if (journalError) {
        redirect("/")
    }
    const entries = await getJournalEntry(journalId, 0, 20)

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
                    {entries?.length  === 0 && <div className={"flex text-muted-foreground flex-col gap-2 h-full items-center justify-center"}>
                        <FrownIcon className={"w-20 h-20"} />
                        <p>This journal has no entry</p>
                    </div>}
                    {entries?.map((entry, index) => {
                        let count = 0
                        const entryDate = new Date(entry?.created_at)
                        const lastUpdatedDate = entry?.updated_at ? new Date(entry?.updated_at) : ""
                        if(!userMap.has(entry?.profiles.email)){
                            userMap.set(entry?.profiles.email, {
                                id: entry?.profiles.id,
                                avatar_url: entry?.profiles.avatar_url,
                                color: userColorWithoutCreator[count],
                                name: entry?.profiles.username,
                                email: entry?.profiles.email,}
                            )
                            count++
                        }
                        return (<Fragment key={entry?.id}>
                            <JournalEntry user={userMap.get(entry?.profiles?.email)}
                                          entryDate={entryDate.toLocaleDateString()}
                                          lastUpdated={lastUpdatedDate ? lastUpdatedDate.toLocaleDateString() : null}
                                          content={entry?.content ?? ""}
                                          isAuthUser={entry?.profiles.id === data.claims.sub}
                                          id={entry?.id}
                                          history={entry?.entries_history}
                            />{index < entries?.length -1
                            && <hr  />}
                        </Fragment>)})}
                </div>
            </div>

        </div>
    );
}
