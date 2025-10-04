"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserIcon} from "lucide-react";
import {User} from "@supabase/auth-js";

export function UserProfileButton({user, isMobile} : {user: User | null, isMobile?: boolean}) {
    const router = useRouter();

    const userRoute = async () => {
        router.push(`/user/${user?.id}`);
    };

    if(user){
        return <Button variant={"ghost"} name={"User Profiles"} onClick={userRoute}><UserIcon /> {isMobile && "Profile"}</Button>;
    }
}
