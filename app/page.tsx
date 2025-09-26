import { Hero } from "@/components/Hero";
import Cloud from "@/components/ui/Cloud";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import Header from "@/components/ui/Header";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) {
    redirect("/journal");
  }
  return (
      <>
        <Header/>
    <main className="h-[calc(100vh_-_80px)] flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="flex-1 flex flex-col gap-15 w-full relative items-center justify-center bg-accent">
          <Hero/>
          <div className={"absolute w-full z-0 h-[90%] top-32"}>
            {Array.from({ length: 12 }).map((_, i) => (<Cloud key={i} scale={i === 0 ? 5: Math.random() * 10/2} opacity={Math.random()} margin={i/2===0 ? i*10 : (i + Math.random())*10 } delay={i * 4} />
            ))}

          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
          <p>
            Powered by Kim Pham
          </p>
        </footer>
      </div>
    </main></>
  );
}
