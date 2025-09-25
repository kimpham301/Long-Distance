"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserIcon} from "lucide-react";
import {User} from "@supabase/auth-js";

export function UserProfileButton({user} : {user: User | null}) {
    const router = useRouter();

    const userRoute = async () => {
        router.push(`/user/${user?.id}`);
    };

    if(user){
        return <Button variant={"ghost"} name={"User Profiles"} onClick={userRoute}><UserIcon /></Button>;
    }
}
