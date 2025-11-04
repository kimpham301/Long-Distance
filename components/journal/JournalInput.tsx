"use client"
import React, {useEffect} from 'react';
import {insertJournal, updateJournalEntry} from "@/lib/serverHelpers";
import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import Loading from "@/components/ui/Loading";
import {EntriesWithProfile, useJournalContext} from "@/components/journal/JournalContextWrapper";

const JournalInput =
    ({ entryId, content, closeEdit}
     : {
        entryId?: number,
        content?: string,
        closeEdit?: () => void
    }) => {
    const {journalId, handleAddNewEntries, handleUpdateEntry} = useJournalContext()
    const [input, setInput] = React.useState<string>(content ?? "");
    const [loading, setLoading] = React.useState(false);
    const hanleInsertEntry = () => {
        setLoading(true)
        if(!closeEdit) {
            insertJournal({journal_id: journalId, content: input}).then((d) => {
                setInput("");
                if(d && handleAddNewEntries){
                    handleAddNewEntries(d as unknown as EntriesWithProfile);
                }
                setLoading(false)
            })
        }
        else  {
            updateJournalEntry({id: entryId, content: input}).then((data) => {
                console.log(data)
                handleUpdateEntry(data as unknown as EntriesWithProfile)
                closeEdit()
            })
        }

    }

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            // @ts-expect-error id exists
            if((e.target?.id !== 'entry-button' && e.target?.id !== "entry-textarea") && closeEdit){
                closeEdit()
            }
        }
        if(closeEdit){
            window.addEventListener("mousedown",handleMouseDown)
        }
        return () => {
            if(closeEdit){
                window.removeEventListener("mousedown", handleMouseDown)
            }
        }
    }, [content, closeEdit]);

    return (
        <div className={"bg-secondary w-full flex gap-3 relative"}>
            {loading && <Loading className={"top-11"}/>}
            <textarea
                id={"entry-textarea"}
                value={input}
                autoFocus={!!closeEdit}
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                placeholder={"How's your day?"}
                className={"w-full h-[90px] p-2 rounded-sm resize-none"}/>
            <Button disabled={loading || !input}  id="entry-button" onClick={hanleInsertEntry}><ChevronRight/></Button>
        </div>
    );
};

export default JournalInput;