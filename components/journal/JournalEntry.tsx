"use client"
import React from 'react';

const JournalEntry = ({userName, entryDate, content}:{userName: string, entryDate: string, content: string}) => {
    return (
        <div className={"px-3 py-5 pb-3 border-b-accent-foreground mb-3 w-full relative"}>
            <span className={'bg-primary px-1 mr-2 rounded text-primary-foreground absolute top-3'}>
                {userName}
            </span>
            <div className={"text-center text-xs w-full"}>{entryDate}</div>
            <div className={"w-full mt-1 relative md:max-w-5xl"}>
                <pre className={"whitespace-pre-wrap w-full min-h-20 "}>{content}</pre>
            </div>
        </div>
    );
};

export default JournalEntry;