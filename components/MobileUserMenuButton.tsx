"use client"
import React from 'react';
import {Button} from "@/components/ui/button";
import {MenuIcon} from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import {UserProfileButton} from "@/components/UserButton";
import {User} from "@supabase/auth-js";
import {LogoutButton} from "@/components/LogoutButton";
import Link from "next/link";

const MobileUserMenuButton = ({user}: {user: User | null}) => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
        <Button variant={"ghost"} onClick={() => {setOpen(!open);}}>
            <MenuIcon/>
        </Button>
            <Drawer direction={"right"} open={open} handleClose={() => setOpen(false)}>
                    { user ? (
                    <div className="flex flex-col gap-3 mt-10 h-full">
                        <UserProfileButton user={user} isMobile/>
                        <LogoutButton isMobile/>
                    </div>
                    ) : (
                    <div className="flex flex-col gap-2 mt-10 h-full">
                        <Button asChild size="sm" variant={"outline"}>
                            <Link href="/auth/login">Sign in</Link>
                        </Button>
                        <Button asChild size="sm" variant={"default"}>
                            <Link href="/auth/sign-up">Sign up</Link>
                        </Button>
                    </div>)
                    }
            </Drawer>
            </>
    );
};

export default MobileUserMenuButton;