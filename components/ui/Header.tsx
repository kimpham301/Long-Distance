import React from 'react';
import {ThemeSwitcher} from "@/components/theme-switcher";
import {hasEnvVars} from "@/lib/utils";
import {EnvVarWarning} from "@/components/env-var-warning";
import {AuthButton} from "@/components/AuthButton";
import {isMobileView} from "@/lib/serverHelpers";
import MobileUserMenuButton from "@/components/MobileUserMenuButton";
import {BookHeart} from "lucide-react";
import JournalPicker from "@/components/JournalPicker";
import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

const Header = async () => {
    const isMobile = await isMobileView();
    const supabase = await createClient();

    // You can also use getUser() which will be slower.
    const { data } = await supabase.auth.getUser();

    const user = data?.user;

    const renderHeaderComponents = () => {
        if (isMobile) {
            return (<div className="w-full flex justify-between items-center p-3 text-sm">
                <div>
                    <BookHeart />
                </div>
                <Link href={"/"} className="flex gap-5 items-center font-semibold text-lg text-primary">
                    Long Distance
                </Link>
                <div className={"flex gap-3 items-center"}>
                    {!hasEnvVars ? <EnvVarWarning/> : <MobileUserMenuButton/>}
                </div>
            </div>)
        }
        else{
            return (<div className="w-full flex justify-between items-center p-8 text-sm">
                <Link href={"/"} className="flex gap-5 items-center font-semibold text-xl text-primary">
                    Long Distance
                </Link>
                <div className={"ml-2"}>
                    <JournalPicker currentUser={user?.id}/>
                </div>
                <div className={"flex gap-3 items-center"}>
                    <ThemeSwitcher/>
                    {!hasEnvVars ? <EnvVarWarning/> : <AuthButton user={user}/>}
                </div>
            </div>)
        }
    }
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            {renderHeaderComponents()}
        </nav>
    );
};

export default Header;