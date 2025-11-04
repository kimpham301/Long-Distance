"use client"
import React, {createContext, use, useEffect, useRef, useState} from 'react';
import {Tables} from "@/database.types";
import {formatDateToYearFirst} from "@/utils/dateFormat";
import {getJournalEntry} from "@/lib/serverHelpers";

export type EntriesWithProfile = Tables<'journal_history'> & {profiles: Tables<'profiles'>, entries_history: Tables<'entries_history'>[]}

type JournalContextType = {
    entries: Map<string, EntriesWithProfile[]>;
    currentItemsCount: number;
    journalId: string;
    totalItemsCount: number;
}

type JournalContextAction = {
    handleAddNewEntries: (entry : EntriesWithProfile) => void;
    scrollableRef: React.RefObject<HTMLDivElement | null>;
    loading: boolean;
    handleScroll: () => void;
    formattedDateArr: string[];
    handleUpdateEntry: (updatedEntry: EntriesWithProfile)=> void;
}
const JournalContext = createContext<Omit<JournalContextType, "totalItemsCount" | "currentItemsCount">  & JournalContextAction| undefined>(undefined)

const useJournalContext = () => {
    const context = use(JournalContext)
    if(!context) {
        throw new Error("useJournalContext must be used within JournalContext")
    }
    return context
}
const JournalContextWrapper: React.FC<JournalContextType & {children: React.ReactNode}> = (props) => {
    const scrollableRef = useRef<HTMLDivElement | null>(null)

    const [entries, setEntries] = React.useState(props.entries);
    const [newEntry, setNewEntry] = React.useState<EntriesWithProfile & {formatDate: string} | null>();
    const [loading, setLoading] =
        useState<boolean>(false);
    const [currentNumItems, setCurrentNumItems] = React.useState<number>(props.currentItemsCount);

    useEffect(() => {
        if(newEntry){
            const allEntryOfDate = entries.get(newEntry.formatDate)
            if(allEntryOfDate && allEntryOfDate?.length > 1)
                document.getElementById('container' + newEntry.id)?.classList.add('animate-flash')
        }
    }, [entries,newEntry]);

    const formattedDateArr = Array.from(entries.keys()).sort((a: string,b: string ) => b.localeCompare(a))

    const handleScroll =  () => {
        if(scrollableRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = scrollableRef.current;
            if((scrollTop + clientHeight > scrollHeight - 24) && !loading && (currentNumItems < props.totalItemsCount)) {
                setLoading(true);
                const oldestDate = formattedDateArr.at(-1)
                getJournalEntry(props.journalId, oldestDate ? new Date(new Date(oldestDate).setDate(new Date(oldestDate).getDate() - 7)).toISOString() : ""
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
    const handleAddNewEntries = (newEntry: EntriesWithProfile) => {
        const tempEntries = new Map(entries)
        const dateFormat = formatDateToYearFirst(new Date(newEntry?.created_at))
        tempEntries.set(dateFormat, [newEntry, ...tempEntries.get(dateFormat) ?? []])
        setEntries(tempEntries)
        setNewEntry({...newEntry, formatDate: dateFormat})
    }

    const handleUpdateEntry = (updatedEntry: EntriesWithProfile)=>{
        const tempEntries = new Map(entries)
        const createdDateOfUpdatedEntry = formatDateToYearFirst(new Date(updatedEntry?.created_at))
        const updatedEntriesArr = tempEntries.get(createdDateOfUpdatedEntry)?.map((entry) => {
            if(entry.id === updatedEntry.id){
                return {
                    ...entry,
                    content: updatedEntry.content,
                    entries_history: updatedEntry.entries_history,
                }
            }
            else return entry
        }) ?? []
        tempEntries.set(createdDateOfUpdatedEntry, updatedEntriesArr)
        setEntries(tempEntries)
    }


    return <JournalContext.Provider value={{
        handleAddNewEntries,
        journalId: props.journalId,
        scrollableRef,
        entries,
        handleScroll,
        loading,
        formattedDateArr,
        handleUpdateEntry
    }}>
        {props.children}
    </JournalContext.Provider>
}

export{JournalContextWrapper, useJournalContext};