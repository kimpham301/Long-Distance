"use client"
import React from 'react';
import Modal from "@/components/ui/Modal";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { XIcon} from "lucide-react";
import {deleteJournal, updateJournal} from "@/lib/serverHelpers";
import {Input} from "@/components/ui/input";
import Loading from "@/components/ui/Loading";
import {useRouter} from "next/navigation";
import {Label} from "@/components/ui/label";

const SETTINGS_JOURNAL_MODAL_ID = "settings-journal-modal";
const SettingsModal = ({journal, closeModal,isUserCreator} :
                       {journal: {generated_id: string, title: string | null, last_update: string | null, long_distance_date: string | null}, closeModal: () => void, isUserCreator:boolean}) => {
    const router = useRouter();
    const [form, setForm] =React.useState({
        title: journal.title ?? "",
        long_distance_date: journal.long_distance_date ?? ""
    })
    const [error, setError] = React.useState('');
    const [deleteMode, setDeleteMode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const formattedDate = journal?.last_update ? new Date(journal?.last_update) : undefined

    const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value, name} = event.target;
        setForm({...form, [name]: value});
    }

    const handleUpdate = async () => {
        setLoading(true);
        const data = await updateJournal(journal.generated_id, form )
        if (!data) {
            setError('Error updating journal');
            setLoading(false);
        }
        else {
            (document.getElementById(SETTINGS_JOURNAL_MODAL_ID)as HTMLDialogElement).close();
            closeModal()
        }
    }

    const handleDelete = async () => {
        setLoading(true);
        const data = await deleteJournal(journal.generated_id)
        if (!data) {
            setError('Error deleting journal');
            setLoading(false);
        }
        else {
            router.push("/journal");
        }
    }
    return (
        <Modal id={SETTINGS_JOURNAL_MODAL_ID}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Journal settings</CardTitle>
                    <CardDescription>
                        Update your journal&#39;s information or delete journal
                    </CardDescription>
                    <Button variant={"ghost"}
                            onClick={() => {
                                (document.getElementById(SETTINGS_JOURNAL_MODAL_ID) as HTMLDialogElement).close();
                                closeModal();
                            }}
                            className={"absolute right-4 top-2"}
                    >
                        <XIcon/>
                    </Button>
                </CardHeader>
                <CardContent className={"flex flex-col gap-3 relative pb-10"}>
                    {loading && <Loading className={"mt-5"} />}
                    <div className="flex items-center justify-between">
                        <Label htmlFor={"title"}>Title</Label>
                        <Input className={"w-[380px]"} disabled={deleteMode || loading} value={form.title} name={"title"} id={"title"} onChange={inputOnChange} />
                    </div>
                    <div className={"flex items-center justify-between"}>
                        <Label htmlFor={"long_distance_date"}>Long distance date</Label>
                    <Input className={"w-[380px]"} disabled={deleteMode || loading} value={form.long_distance_date} type={"date"} name={"long_distance_date"} id={"long_distance_date"} onChange={inputOnChange} />
                    </div>
                    {error && <div className={"text-error"}>{error}</div>}
                    {deleteMode && <div className={"absolute z-10 w-full bottom-0 left-0 border-accent py-3 px-6 bg-background"}>
                        <h6>Are you sure you want to delete <b>{journal.title}</b>? This action cannot be undone.</h6>
                        <div className={"float-end"}>
                            <Button variant={"destructive"} onClick={handleDelete}>Yes</Button>
                            <Button variant={'secondary'} className={"ml-4"} onClick={() => setDeleteMode(false)}>No</Button>
                        </div>
                    </div>}
                </CardContent>
                <CardFooter className={"flex justify-between"}>
                    {isUserCreator && <Button disabled={deleteMode} variant={"destructive"} onClick={() => setDeleteMode(true)}>
                        Delete journal
                    </Button>}
                    <div>
                         <span
                             className={"text-[12px] text-muted-foreground mr-2"}>Last Updated: {formattedDate?.toLocaleString("en-US", {
                             year: 'numeric',
                             month: "numeric",
                             day: "numeric"
                         })}</span>
                        <Button disabled={deleteMode || loading} onClick={handleUpdate}>
                            Update
                        </Button></div>
                </CardFooter>
            </Card>
        </Modal>
    );
};

export {SettingsModal, SETTINGS_JOURNAL_MODAL_ID};