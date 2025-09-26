"use client"
import React from 'react';
import {Card, CardHeader} from "@/components/ui/card";
import Link from "next/link";

const JournalCard = ({journal} : {journal: {generated_id: string, title: string | null} | null}) => {
    if(!journal) return null
    return (
        <Link key={journal.generated_id}
              href={window.location.origin + "/journal/" + journal.generated_id}>
            <Card className={"p-5"}>
                <CardHeader>
                    {journal.title}
                </CardHeader>
            </Card>
        </Link>
    );
};

export default JournalCard;