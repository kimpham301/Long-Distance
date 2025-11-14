"use client"
import React from 'react';
import {Tables} from "@/database.types";
import JournalEntry from "@/components/journal/JournalEntry";
import JournalInput from "@/components/journal/JournalInput";
import {FrownIcon} from "lucide-react";
import {useJournalContext} from "@/components/journal/JournalContextWrapper";

export type ProfileWithColor = Tables<'profiles'> & {color: string}

const JournalEntriesList =
    ({ userMap, authUser}
     : {
        userMap: Map<string | null, ProfileWithColor>,
        authUser: string,
    }) => {
        const {
            scrollableRef,
            handleScroll,
            entries,
            loading,
            formattedDateArr
        } = useJournalContext();

    return (
        <div className="flex flex-col flex-grow gap-2 bg-secondary h-full rounded-sm p-3 w-full">
            <JournalInput />
            {entries.size  === 0 && <div className={"flex text-muted-foreground flex-col gap-2 h-full items-center justify-center"}>
                <FrownIcon className={"w-20 h-20"} />
                <p>This journal has no entry</p>
            </div>}
        <div ref={scrollableRef} className={"flex flex-col overflow-auto p-3"} onScroll={handleScroll}>
            {formattedDateArr && formattedDateArr.map((date) => {
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
                            {entries.get(date)?.map((et) => {
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