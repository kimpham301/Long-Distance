import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JournalCard from "@/components/journal/JournalCard";

export default async function JournalListPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }
  const {data: journal} = await supabase.from("user_journal_access").select(`is_default, journal(generated_id, title)`);
  const defaultJournal = journal?.find(journal => journal.is_default === true)
  if(defaultJournal){
      redirect(`/journal/${defaultJournal.journal?.generated_id}`);
  }
  else {
      return (
          <div className={"flex flex-col mt-4 mx-3 gap-4"}>
            <h2 className={"font-bold text-xl"}>Journals</h2>
          <div className={"flex h-full gap-4"}>
        {journal?.map((journal) => {
          return (
              <JournalCard key={journal?.journal?.generated_id} journal={journal.journal}/>)
        })}
            <JournalCard key={"new-journal-card"}/>
      </div>
          </div>);
  }
}
