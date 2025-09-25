"use client"
import React, {useEffect, useState} from 'react';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {createClient} from "@/lib/supabase/client";
import {useParams, useRouter} from "next/navigation";
import {ChevronDown, PlusIcon} from "lucide-react";
import Loading from "@/components/ui/Loading";

const JournalPicker = ({currentUser}: {currentUser: string | undefined}) => {
    const router = useRouter();
    const supabase =createClient()
    const params = useParams<{ journalId: string }>()
    const [journals, setJournals] = useState<{ generated_id: string, title: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        supabase.from("journal").select("generated_id, title").eq("created_user", currentUser).then((data) => {
            setLoading(false)
            return data?.data || !data?.error ? setJournals(data.data) : setJournals([])})
    }, [supabase, currentUser])

    const handleChangeJournal = (journalId:string) => {
        router.push(`/journal/${journalId}`);
    }
    if(!params?.journalId) {
        return null
    }
    if(loading){
        return <Loading className={"top-5"} />
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {journals.find(journal => journal.generated_id === params?.journalId)?.title}
                    <ChevronDown/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-content" align="center">
                <DropdownMenuRadioGroup
                    value={params.journalId}
                    onValueChange={(e) => handleChangeJournal(e)}
                >
                    {journals.map((journal) => (
                        <DropdownMenuRadioItem key={journal.generated_id} value={journal.generated_id}><span>{journal.title}</span></DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
                {/*<DropdownMenuItem onClick={() => {console.log('new')}} className={"text-primary"}><PlusIcon className={"size-4"}/> New Journal</DropdownMenuItem>*/}

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default JournalPicker;