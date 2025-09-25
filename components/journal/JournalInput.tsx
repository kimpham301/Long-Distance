"use client"
import React from 'react';
import {insertJournal} from "@/lib/serverHelpers";
import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import Loading from "@/components/ui/Loading";

const JournalInput = ({journalId}:{journalId: string}) => {
    const [input, setInput] = React.useState<string>("");
    const [loading, setLoading] = React.useState(false);
    const hanleInsertEntry = () => {
        setLoading(true)
        insertJournal({journal_id: journalId,   content: input}).then( ()=> {
            setInput("");
            setLoading(false)})
    }

    return (
        <div className={"bg-secondary w-full flex gap-3 relative"}>
            {loading && <Loading className={"top-11"}/>}
            <textarea value={input}
                      disabled={loading}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={ "New entry..."}
                      className={"w-full h-[90px] p-2 rounded-sm resize-none"}/>
            <Button onClick={hanleInsertEntry}><ChevronRight/></Button>
        </div>
    );
};

export default JournalInput;