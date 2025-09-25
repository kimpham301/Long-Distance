import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function JournalListPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }
  const {data: journal} = await supabase.from("journal").select(`generated_id, default`).eq('default', true).limit(1).single();
  if(journal){
      redirect(`/journal/${journal.generated_id}`);
  }
  else {
      return redirect("/journal/error");
  }
}
