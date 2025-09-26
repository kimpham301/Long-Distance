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
  if(journal?.length === 0){
    return (<>
      <div>No Journal :(</div>
    </>)
  }
  else {
      return (
          <div className={"flex justify-center items-center h-full"}>
        {journal?.map((journal) => {
          return (
              <JournalCard key={journal?.journal?.generated_id} journal={journal.journal}/>)
        })}

      </div>);
  }
}
