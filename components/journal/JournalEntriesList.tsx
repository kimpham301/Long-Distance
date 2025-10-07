"use client"
import React, {Fragment, useRef, useState} from 'react';
import {Tables} from "@/database.types";
import JournalEntry from "@/components/journal/JournalEntry";

type ProfileWithColor = Tables<'profiles'> & {color: string}
type EntriesWithProfile = Tables<'journal_history'> & {profiles: Tables<'profiles'>, entries_history: Tables<'entries_history'>[]}
const JournalEntriesList =
    ({initMap, userMap, authUser, journalId, totalCount, currentItemsCount}
     : {initMap:Map<string | undefined | null, EntriesWithProfile[]>,
        userMap: Map<string | undefined | null, ProfileWithColor>,
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
    const entriesArr = Array.from(entries.entries())

    const handleScroll = async () => {
        if(scrollableRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = scrollableRef.current;
            if((scrollTop + clientHeight > scrollHeight - 80) && !loading && (currentNumItems < totalCount)) {
                setLoading(true);
            }
        }
    }
    return (
        <div ref={scrollableRef} className={"flex flex-col h-full overflow-auto p-3"} onScroll={handleScroll}>
            {entriesArr && entriesArr.map(([date, entry]) => {
                return (
                    <Fragment key={date}>
                        <div className={"w-full text-muted-foreground text-center relative animate-slide-down"}>
                            <hr className={"mt-3"}/>
                            <span
                                className={"bg-secondary absolute right-1/2 translate-x-1/2 top-0 px-2"}>{date}</span>
                        </div>
                        <div className={"flex flex-col-reverse"}>
                            {entry?.map((et, index) => {
                                const profile = userMap.get(et?.profiles.email)
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

                    </Fragment>
                )

            })}
           {loading && <span className={"m-auto text-muted-foreground"}> Loading more...</span>}

        </div>
    );
    };

export default JournalEntriesList;