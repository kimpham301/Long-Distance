import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./LogoutButton";
import {User} from "@supabase/auth-js";
import {UserProfileButton} from "@/components/UserButton";

export async function AuthButton({user} : {user: User | null}) {
  return user ? (
    <div className="flex items-center gap-1">
        <UserProfileButton user={user} />
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
