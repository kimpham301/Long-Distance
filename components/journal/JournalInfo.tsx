"use client"
import React from 'react';

const JournalInfo = ({title, date, isMobile}: {title: string, date: Date, isMobile: boolean}) => {
if (isMobile) return null
    return (
        <>
            <div className="flex gap-2 h-full p-3">
                <div>
                    <h6 className={"font-semibold"}>{title}</h6>
                    <span className={"text-sm text-accent-foreground"}>{date.toLocaleString("en-US", {
                        year: 'numeric',
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}</span>
                </div>
            </div>
            <hr className={"border-border h-full"} style={{borderWidth: "0.5px"}}/>
        </>
    );
};

export default JournalInfo;