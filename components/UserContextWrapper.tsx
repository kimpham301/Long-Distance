"use client"

import React, {createContext, use, useCallback, useMemo} from "react";
import {createClient} from "@/lib/supabase/client";

interface UserProfile {
    id?: string | undefined;
    username: string | null;
    email: string | null;
    avatar_url: string | null;
}

interface UserProfileActions{
    changeAvatar: (url: string) => void;
    changeUsername: (name: string) => void;
    getId: () => string | undefined;
    profile: UserProfile | undefined;}
const UserContext = createContext<UserProfileActions  | undefined>(undefined);

const useUserContext = () => {
    const context = use(UserContext);

    if (!context) {
        throw new Error('useUser must be used within a UserContextWrapper')
    }

    return context
}

const UserContextWrapper = ({children, userId, existingProfile}: {children: React.ReactNode, userId: string, existingProfile?:UserProfile}) => {
    const supabase = createClient()
    const [profile, setProfile] = React.useState<UserProfile | undefined>(existingProfile)

    React.useEffect(() => {
        async function getProfile() {
            const {data: profileData, error : errorProfile} = await supabase.from("profiles").select("username, email, avatar_url").eq("id", userId).single();
            if(errorProfile) return {
                id: userId,
                username: "",
                email: "",
                avatar_url: ""
            }
            return {
                id: userId,
                username: profileData.username,
                email: profileData.email,
                avatar_url: profileData.avatar_url
            }
        }
        if(userId && !existingProfile){
            getProfile().then((d) => setProfile(d) )
        }
    },[userId, supabase, existingProfile])

    const changeAvatar= (url: string) => {
        if(profile){
            setProfile({...profile, avatar_url: url})

        }
    }

    const changeUsername = (name: string) => {
        if(profile){
            setProfile({...profile, username: name});
        }
    };
    const getId= () => {
        return profile?.id;
    };

    const value = useMemo(() =>
        ({changeAvatar,
            changeUsername,
            getId,
            profile}),
        [profile])
    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}

export {useUserContext, UserContextWrapper}