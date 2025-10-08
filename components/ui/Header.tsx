import React from 'react';
import {ThemeSwitcher} from "@/components/theme-switcher";
import {AuthButton} from "@/components/AuthButton";
import {isMobileView} from "@/lib/serverHelpers";
import MobileUserMenuButton from "@/components/MobileUserMenuButton";
import JournalPicker from "@/components/journal/JournalPicker";
import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import JournalInfoDrawer from "@/components/JournalInfoDrawer";

const Header = async ({hideAuthBtn, showJournalInfo}: {hideAuthBtn?: boolean, showJournalInfo?: boolean}) => {
    const isMobile = await isMobileView();
    const supabase = await createClient();

    const { data } = await supabase.auth.getUser();

    const user = data?.user;

    const renderHeaderComponents = () => {
        if (isMobile) {
            return (<div className="w-full flex justify-between items-center p-3 text-sm">
                <div>
                    {showJournalInfo && <JournalInfoDrawer user={user}/>}
                </div>
                <div>
                    <Link href={"/"} className="flex gap-5 items-center font-semibold text-xl text-primary">
                        Long Distance
                    </Link>
                </div>
                <div className={"flex gap-3 items-center"}>
                    {!hideAuthBtn && <MobileUserMenuButton user={user}/>}
                </div>
            </div>)
        } else {
            return (<div className="w-full flex justify-between items-center p-8 text-sm">
                <Link href={"/"} className="flex gap-5 items-center font-semibold text-xl text-primary">
                    Long Distance
                </Link>
                <div className={"ml-2"}>
                    <JournalPicker currentUser={user?.id}/>
                </div>
                <div className={"flex gap-3 items-center"}>
                    <ThemeSwitcher/>
                    {!hideAuthBtn && <AuthButton user={user}/>}
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