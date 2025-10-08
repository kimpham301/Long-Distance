import { Button } from "@/components/ui/button";
import { UserIcon} from "lucide-react";
import {User} from "@supabase/auth-js";
import Link from "next/link";

export function UserProfileButton({user, isMobile} : {user: User | null, isMobile?: boolean}) {
    if(user){
        return(
        <Button name={"User Profile"} asChild size="sm" variant={"ghost"} className={isMobile ? "justify-start text-xl [&_svg]:size-5": ""}>
            <Link href={`/user/${user?.id}`}><UserIcon /> {isMobile && "Profile"}</Link></Button>)
    }
}
