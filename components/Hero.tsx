import {Button} from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
      <div className="flex flex-col gap-16 items-center z-10">
          <div className="flex gap-8 justify-center items-center">

          </div>
          <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
          <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
              Journal for long distance partners
          </p>
          <div className={"w-full flex justify-center"}>
              <Button asChild size="lg">
                  <Link href="/auth/login">Start your journal</Link>
              </Button>
          </div>
      </div>
  );
}
