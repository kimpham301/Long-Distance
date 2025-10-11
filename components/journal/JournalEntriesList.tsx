"use client"
import React, {useEffect, useRef, useState} from 'react';
import {Tables} from "@/database.types";
import JournalEntry from "@/components/journal/JournalEntry";
import {getJournalEntry} from "@/lib/serverHelpers";
import JournalInput from "@/components/journal/JournalInput";
import {FrownIcon} from "lucide-react";
import {formatDateToYearFirst} from "@/utils/dateFormat";

export type ProfileWithColor = Tables<'profiles'> & {color: string}
export type EntriesWithProfile = Tables<'journal_history'> & {profiles: Tables<'profiles'>, entries_history: Tables<'entries_history'>[]}
const JournalEntriesList =
    ({initMap, userMap, authUser, journalId, totalCount, currentItemsCount}
     : {initMap:Map<string, EntriesWithProfile[]>,
        userMap: Map<string | null, ProfileWithColor>,
        authUser: string,
        journalId: string,
        totalCount: number,
        currentItemsCount:number
    }) => {
    const scrollableRef = useRef(null)
    const [loading, setLoading] =
        useState<boolean>(false);
    const [currentNumItems, setCurrentNumItems] = React.useState<number>(currentItemsCount);
    const [entries, setEntries] = React.useState(initMap);
    const [newEntry, setNewEntry] = React.useState<EntriesWithProfile & {formatDate: string} | null>();

        const dateArray = Array.from(entries.keys()).sort((a: string,b: string ) => b.localeCompare(a))
        const handleAddNewEntries = (newEntry: EntriesWithProfile) => {
            const tempEntries = new Map(entries)
            const dateFormat = formatDateToYearFirst(new Date(newEntry?.created_at))
            tempEntries.set(dateFormat, [newEntry, ...tempEntries.get(dateFormat) ?? []])
            console.log(tempEntries)
            setEntries(tempEntries)
            setNewEntry({...newEntry, formatDate: dateFormat})
        }

    const handleScroll =  () => {
        if(scrollableRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = scrollableRef.current;
            if((scrollTop + clientHeight > scrollHeight - 24) && !loading && (currentNumItems < totalCount)) {
                setLoading(true);
                const oldestDate = dateArray.at(-1)
                getJournalEntry(journalId, oldestDate ? new Date(new Date(oldestDate).setDate(new Date(oldestDate).getDate() - 7)).toISOString() : ""
                    ,oldestDate ? new Date(oldestDate).toISOString() : "").then((data) => {
                        setCurrentNumItems((prev) => prev + data?.length)
                    const newEntriesMap = entries
                    data?.forEach(d => {
                        const entryDate = formatDateToYearFirst(new Date(d?.created_at));
                        newEntriesMap.set(entryDate, [...(newEntriesMap.get(entryDate) ?? []),d as EntriesWithProfile])
                    })
                    setEntries(newEntriesMap)
                    setLoading(false);
                })
            }
        }
    }

        useEffect(() => {
            if(newEntry){
                const allEntryOfDate = entries.get(newEntry.formatDate)
                if(allEntryOfDate && allEntryOfDate?.length > 1)
                document.getElementById('container' + newEntry.id)?.classList.add('animate-flash')
            }
        }, [newEntry]);

    return (
        <div className="flex flex-col flex-grow gap-2 bg-secondary h-full rounded-sm p-3">
            <JournalInput journalId={journalId} handleNewEntry={handleAddNewEntries}/>
            {totalCount  === 0 && <div className={"flex text-muted-foreground flex-col gap-2 h-full items-center justify-center"}>
                <FrownIcon className={"w-20 h-20"} />
                <p>This journal has no entry</p>
            </div>}
        <div ref={scrollableRef} className={"flex flex-col overflow-auto p-3"} onScroll={handleScroll}>
            {dateArray && dateArray.map((date) => {
                return (
                    <div key={date} className={"animate-slide-down"}>
                        <div className={"w-full text-muted-foreground text-center relative animate-slide-down"}>
                            <hr className={"top-2.5 absolute w-full"}/>
                            <span
                                className={"bg-secondary absolute right-1/2 translate-x-1/2 top-0 px-2 text-[14px]"}>
                                {new Date(entries.get(date)?.[0].created_at ?? "").toLocaleDateString()}
                            </span>
                        </div>
                        <div className={"flex flex-col"}>
                            {entries.get(date)?.map((et, index) => {
                                const profile = userMap.get(et?.profiles.id) ?? {
                                    ...et.profiles,
                                    color: 'bg-gray-400'
                                }
                                const lastUpdatedDate = et?.updated_at ? new Date(et?.updated_at) : ""
                                const entryTime = et?.created_at ? new Date(et?.created_at) : ""
                                if (et?.id && profile) {
                                    return <JournalEntry key={et?.id}
                                                         id={et?.id}
                                                         user={profile}
                                                         entryDate={entryTime ? entryTime.toLocaleTimeString([], {
                                                             hour: '2-digit',
                                                             minute: '2-digit'
                                                         }) : null}
                                                         lastUpdated={lastUpdatedDate ? lastUpdatedDate.toLocaleDateString() : null}
                                                         content={et?.content ?? ""}
                                                         isAuthUser={et?.profiles.id === authUser}
                                                         history={et.entries_history}
                                    />
                                } else return null

                            })
                            }
                        </div>

                    </div>
                )

            })}
           {loading && <span className={"m-auto text-muted-foreground"}> Loading more...</span>}

        </div>
        </div>
    );
    };

export default JournalEntriesList;