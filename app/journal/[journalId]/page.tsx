import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JournalInfo from "@/components/journal/JournalInfo";
import {getJournalEntry, isMobileView} from "@/lib/serverHelpers";
import JournalEntriesList from "@/components/journal/JournalEntriesList";
import {formatDateToYearFirst} from "@/utils/dateFormat";

const USER_COLOR = ['bg-primary','bg-orange-400','bg-emerald-700']
export default async function JournalPage({params}: {params: Promise<{journalId: string}>}) {
    const supabase = await createClient();
    const {journalId} =  await params
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }
    const {data: journal, error: journalError} = await supabase.from("journal")
        .select(`generated_id, last_update, created_user, profiles(username, email, avatar_url), title, long_distance_date, journal_history(count)`)
        .eq("generated_id", journalId)
        .single();
    if (journalError) {
        redirect("/")
    }
    const currentDate= new Date();
    const entries = await getJournalEntry(journalId, new Date(new Date().setDate(currentDate.getDate() - 7)).toISOString(), currentDate.toISOString());

    const isMobile = await isMobileView();
    const userMap = new Map();
    const entriesMap = new Map();
    userMap.set(journal.profiles.email, {
        id: journal?.created_user,
        avatar_url: journal?.profiles.avatar_url,
        color: USER_COLOR[0],
        username: journal?.profiles.username})
    const userColorWithoutCreator = USER_COLOR.slice(1);
    const isUserCreator = journal.created_user === data.claims.sub
    entries?.forEach((entry) => {
        let count = 0
        const entryDate = new Date(entry?.created_at)
        const formatDate = formatDateToYearFirst(entryDate)
        entriesMap.set(formatDate, [...(entriesMap.get(formatDate) ?? []),entry])
        if(!userMap.has(entry?.profiles.email)){
            userMap.set(entry?.profiles.email, {
                ...entry.profiles,
                color: userColorWithoutCreator[count],
              }
            )
            count++
        }})

    return (
        <div className="flex-1 w-full flex gap-8 h-full">
            <JournalInfo journal={journal}
                         isMobile={isMobile}
                         userMap={userMap}
                         isUserCreator={isUserCreator}/>

                <JournalEntriesList initMap={entriesMap}
                                    userMap={userMap}
                                    authUser={data.claims.sub}
                                    totalCount={journal.journal_history[0].count}
                                    currentItemsCount={entries?.length}
                                    journalId={journalId}
                />
        </div>
    );
}
