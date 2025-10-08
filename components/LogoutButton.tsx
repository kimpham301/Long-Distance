"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {LogOutIcon} from "lucide-react";

export function LogoutButton({isMobile}: {isMobile?: boolean}) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return <Button variant={"ghost"} name={"Logout"} onClick={logout} className={isMobile ? "justify-start text-xl [&_svg]:size-5": ""}>
    <LogOutIcon /> {isMobile && "Logout"}
  </Button>;
}
