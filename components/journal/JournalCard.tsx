"use client"
import React from 'react';
import {Card, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";

const JournalCard = ({journal} : {journal?: {generated_id: string, title: string | null} | null}) => {
    if(!journal)
        return(
            <Button variant={"ghost"} className={'w-56 h-40 p-0'}>
        <Card className={"w-full h-full content-center justify-center bg-muted"}>
            <CardHeader className={"flex items-center gap-2 font-bold"}>
                <PlusIcon className={"w-24 h-24"}/> New journal
            </CardHeader>
        </Card>
    </Button>)

    return (
        <Link key={journal.generated_id}
              href={window.location.origin + "/journal/" + journal.generated_id}>
            <Card className={"p-5 w-56 h-40 content-center"}>
                <CardHeader className={"text-center font-bold"}>
                    {journal.title}
                </CardHeader>
            </Card>
        </Link>
    );
};

export default JournalCard;