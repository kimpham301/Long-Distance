import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JournalInfo from "@/components/journal/JournalInfo";
import { getJournalEntry, getTotalEntries, isMobileView} from "@/lib/serverHelpers";
import JournalEntriesList from "@/components/journal/JournalEntriesList";
import {formatDateToYearFirst} from "@/utils/dateFormat";
import JournalUserPreferenceCard from "@/components/journal/JournalUserPreferenceCard";
import React from "react";
import {JournalContextWrapper} from "@/components/journal/JournalContextWrapper";

export default async function JournalPage({params}: {params: Promise<{journalId: string}>}) {
    const supabase = await createClient();
    const {journalId} =  await params
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }
    const currentDate= new Date();
    const {data: currentProfile} = await supabase.from("profiles").select("email, username").eq('id', data?.claims.sub).single()
    const entries = await getJournalEntry(journalId, new Date(new Date().setDate(currentDate.getDate() - 14)).toISOString(), currentDate.toISOString());
    const entriesCount = await getTotalEntries(journalId);
    const isMobile = await isMobileView();

    const userMap = new Map();
    const {data: journalUserPref} = await supabase.from("journal_user_preference").select("display_name, color, profiles(*)")
    journalUserPref?.map(up => {
            if(!userMap.has(up?.profiles.id)){
                userMap.set(up?.profiles.id, {
                        ...up.profiles,
                        color: "bg-" + up.color,
                    }
                )
            }
        })
    const entriesMap = new Map();

    entries?.forEach((entry) => {
        const entryDate = new Date(entry?.created_at)
        const formatDate = formatDateToYearFirst(entryDate)
        entriesMap.set(formatDate, [...(entriesMap.get(formatDate) ?? []),entry])
        })

    if(journalUserPref && !journalUserPref.find(j => j.profiles.id === data.claims.sub)){
        return <div className={"flex w-full h-full justify-center items-center"}>
            <JournalUserPreferenceCard user={{id: data.claims.sub,
        username: currentProfile?.username,
            email: currentProfile?.email}}
            existingProfiles={journalUserPref}/></div>
    }
    return (
        <div className="flex-1 w-full flex gap-8 h-full">
            {!isMobile && <><JournalInfo currentUser={data.claims.sub} />
                <hr className={"border-border h-full"} style={{borderWidth: "0.5px"}}/>

            </>}

            <JournalContextWrapper journalId={journalId} entries={entriesMap} currentItemsCount={entries?.length} totalItemsCount={entriesCount ?? 0}>
            <JournalEntriesList userMap={userMap}
                                    authUser={data.claims.sub}
                />
            </JournalContextWrapper>
        </div>
    );
}
