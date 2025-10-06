import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JournalList from "@/components/journal/JournalList";

export default async function JournalListPage({searchParams} :{searchParams: Promise<{view_all: boolean}>}) {
  const supabase = await createClient();

  const {view_all} =await searchParams;
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }
  const {data: journal} = await supabase.from("user_journal_access").select(`is_default, journal(generated_id, title)`);
  const defaultJournal = journal?.find(journal => journal.is_default === true)
  if(defaultJournal && !view_all){
      redirect(`/journal/${defaultJournal.journal?.generated_id}`);
  }
  else {
      const formatJournal = journal?.map(({journal}) => ({generated_id: journal.generated_id, title: journal.title}))
      return (
          <div className={"h-full mt-4 mx-3 gap-4"}>
            <h2 className={"font-bold text-xl mb-6"}>Journals</h2>
            <JournalList userId={data.claims.sub} journal={formatJournal} />
          </div>);
  }
}
