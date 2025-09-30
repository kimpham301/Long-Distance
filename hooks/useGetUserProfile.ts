"use client"
import {createClient} from "@/lib/supabase/client";
import {useState} from "react";
import {User} from "@supabase/auth-js";

export const useGetUserProfile =  () => {
    const supabase = createClient()
    const [user, setUser] = useState<User | null>(null)
    supabase.auth.getUser().then(({data, error}) => {
        if(error) throw error;
        setUser(data.user)
    })
    return user;
}
