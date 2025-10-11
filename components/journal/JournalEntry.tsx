"use client"
import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {EditIcon, History, XIcon} from "lucide-react";
import JournalInput from "@/components/journal/JournalInput";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Modal from "@/components/ui/Modal";
import {Tables} from "@/database.types";

const JournalEntry = (
    {id,
        user,
        entryDate,
        lastUpdated,
        content,
        isAuthUser,
        history,
    }
    :{id: number,
       user: Tables<'profiles'> & {color: string},
    entryDate: string | null,
        lastUpdated: string | null,
    content: string,
        isAuthUser: boolean,
    history?: {content?:string, created_at: string}[]}) => {
    const [editMode, setEditMode] = React.useState(false);
    const [viewHistory, setViewHistory] = React.useState(false);
    const userColor = user.color
    const userName = user.username ?? user.email?.split("@")[0] ?? "N/A"

    useEffect(() => {
        if(viewHistory){
            (document.getElementById("entry-history-modal" + id) as HTMLDialogElement).showModal();
        }
    }, [viewHistory, id])
    return (
        <>
            <div id={"container" + id} className={"px-3 py-5 border-b-accent-foreground mb-3 w-full relative"}>
                <div className={"flex items-center relative"}>
                 <span className={`px-1 mr-2 rounded text-primary-foreground ${userColor}`}>
                {userName}
            </span>
                    <div className={"text-xs absolute w-full flex justify-center gap-2"}>{lastUpdated && <Button onClick={() => {
                        setViewHistory(true)
                    }} variant={"ghost"} className={"p-0 h-4"}><History
                        className={"w-4 h-4 text-muted-foreground"}/></Button>} {entryDate}</div>
                    {isAuthUser && !editMode ? <div className={"top-2 right-0 ml-auto"}>
                        <Button variant={"ghost"} onClick={() => {
                            setEditMode(true)
                        }}><EditIcon className={"text-muted-foreground"}/></Button>
                    </div> : <div className={'min-w-12 min-h-10'}></div>}

                </div>
                <div className={"w-full mt-1 relative md:max-w-5xl"}>
                    {!editMode ? <pre className={"whitespace-pre-wrap w-full min-h-20 "}>{content}</pre>
                        : <JournalInput entryId={id} content={content} closeEdit={() => setEditMode(false)}/>}
                </div>
            </div>
            {viewHistory && <Modal id={"entry-history-modal" + id}>
            <Card className={"flex flex-col gap-4 w-full"}>
                    <CardHeader>
                        <CardTitle>
                            History
                        </CardTitle>
                        <Button variant={"ghost"}
                                onClick={() => {
                                    (document.getElementById("entry-history-modal" + id) as HTMLDialogElement).close();
                                    setViewHistory(false);
                                }}
                                className={"absolute right-4 top-2"}
                        >
                            <XIcon/>
                        </Button>
                    </CardHeader>
                    <CardContent className={"flex flex-col gap-4 w-full max-w-4xl overflow-auto"}>
                    {history?.map(entry => {
                        return (
                            <div key={entry.created_at}>
                            <div className={"w-full text-center text-xs text-muted-foreground mb-2"}>
                                {new Date(entry.created_at).toLocaleString()}
                            </div>
                                <pre className={"whitespace-pre-wrap"}>
                                    {entry.content}
                                </pre>
                            </div>
                        )
                        }) }
                    </CardContent>
                        </Card>
                        </Modal>}
                </>
                );
};

export default JournalEntry;