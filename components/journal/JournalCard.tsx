"use client"
import React from 'react';
import {Card, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import Loading from '../ui/Loading';

const JournalCard = ({journal} : {journal?: {generated_id: string, title: string | null, pending? :boolean} | null}) => {
    if(!journal)
       return null

    return (
        <Link key={journal.generated_id}
              href={window.location.origin + "/journal/" + journal.generated_id}>
            <Card className={"p-5 w-full h-full md:w-56 md:h-40 content-center relative"}>
                <CardHeader className={"text-center font-bold"}>
                    {journal.title}
                </CardHeader>
                {journal.pending && <Loading className={"bottom-10"}/>}
            </Card>
        </Link>
    );
};

export default JournalCard;