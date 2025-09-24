import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JournalInput from "@/components/journal/JournalInput";
import JournalEntry from "@/components/journal/JournalEntry";
import JournalInfo from "@/components/journal/JournalInfo";
import {headers} from "next/headers";
import {userAgentFromString} from "next/server";

export default async function JournalPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }
  const {data: journal} = await supabase.from("journal").select(`generated_id, last_update, title, journal_history(*, profiles(username))`).limit(1).single();
  const formattedDate = new Date(journal?.last_update)
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");
    const { device } = userAgentFromString(userAgent || '');
    const isMobile = device.type === 'mobile';

    return (
    <div className="flex-1 w-full flex gap-8 h-full">
        <JournalInfo title={journal?.title} date={formattedDate} isMobile={isMobile} />
        <div className="flex flex-col flex-grow gap-2 bg-secondary h-full rounded-sm p-3">
            <JournalInput journalId={journal?.generated_id}/>
            <div className={"flex flex-col-reverse h-full overflow-auto p-3"}>
                {journal?.journal_history?.map((entry, index) => { const entryDate = new Date(entry?.created_at)
                    console.log(entry)
                    return (<><JournalEntry key={entry?.id} userName={entry?.profiles?.username}
                                                                        entryDate={entryDate.toLocaleString()}
                                                                        content={entry?.content}/>{index < journal?.journal_history?.length -1 && <hr />}</>)})}
            </div>
        </div>

    </div>
  );
}
