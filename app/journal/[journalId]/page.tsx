import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JournalInput from "@/components/journal/JournalInput";
import JournalEntry from "@/components/journal/JournalEntry";
import JournalInfo from "@/components/journal/JournalInfo";
import {Fragment} from "react";
import {isMobileView} from "@/lib/serverHelpers";

export default async function JournalPage({params}: {params: {journalId: string}}) {
    const supabase = await createClient();
    const {journalId} =  await params
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }
    const {data: journal, error: journalError} = await supabase.from("journal")
        .select(`generated_id, last_update, created_user, title, entries:journal_history(*, profiles(username))`)
        .eq("generated_id", journalId)
        .order('created_at', { ascending: false, referencedTable: "entries"}).single();
    if (journalError) {
        redirect("/")
    }
    const isMobile = await isMobileView();
    return (
        <div className="flex-1 w-full flex gap-8 h-full">
            <JournalInfo journal={journal}  isMobile={isMobile} />
            <div className="flex flex-col flex-grow gap-2 bg-secondary h-full rounded-sm p-3">
                <JournalInput journalId={journal?.generated_id}/>
                <div className={"flex flex-col h-full overflow-auto p-3"}>
                    {journal?.entries?.map((entry, index) => {
                        const entryDate = new Date(entry?.created_at)
                        return (<Fragment key={entry?.id}>
                            <JournalEntry userName={entry?.profiles?.username ?? "N/A"}
                                          entryDate={entryDate.toLocaleString()}
                                          content={entry?.content ?? ""}/>{index < journal?.entries?.length -1
                            && <hr  />}
                        </Fragment>)})}
                </div>
            </div>

        </div>
    );
}
