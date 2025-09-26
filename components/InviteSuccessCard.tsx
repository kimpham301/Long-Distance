"use client"
import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const InviteSuccessCard = ({ isUserLogin, inviteCode, journalTitle}: { isUserLogin: boolean, inviteCode?: string, journalTitle: string}) => {
    if(inviteCode && !isUserLogin){
        sessionStorage.setItem("invite_code", inviteCode)
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            You&#39;ve been invited to {journalTitle}.
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                            {isUserLogin ? "You can now read and update journal. Have fun!" : `Please login to view journal`}
                        </p>
                        <Link href={isUserLogin ? `/auth/login` : `/journal`}>
                            <Button>
                                {isUserLogin ? "Go to journal" : "Login"}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

                export default InviteSuccessCard;