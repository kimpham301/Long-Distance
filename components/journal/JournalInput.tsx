"use client"
import React, {useEffect} from 'react';
import {insertJournal, updateJournalEntry} from "@/lib/serverHelpers";
import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import Loading from "@/components/ui/Loading";

const JournalInput =
    ({journalId, entryId, content, closeEdit}
     :{journalId?: string,
        entryId? :number,
        content?: string,
    closeEdit? :() => void}) => {
    const [input, setInput] = React.useState<string>(content ?? "");
    const [loading, setLoading] = React.useState(false);
    const hanleInsertEntry = () => {
        setLoading(true)
        if(journalId) {
            insertJournal({journal_id: journalId, content: input}).then(() => {
                setInput("");
                setLoading(false)
            })
        }
        else if(closeEdit) {
            updateJournalEntry({id: entryId, content: input}).then(() => {
                closeEdit()
            })
        }

    }

    useEffect(() => {
        const handleMouseDown = (e) => {
            if((e.target.id !== 'entry-button' && e.target.id !== "entry-textarea") && closeEdit){
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
                      placeholder={ "New entry..."}
                      className={"w-full h-[90px] p-2 rounded-sm resize-none"}/>
            <Button id="entry-button" onClick={hanleInsertEntry}><ChevronRight/></Button>
        </div>
    );
};

export default JournalInput;