"use client"
import React from 'react';
import Modal from "@/components/ui/Modal";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {XIcon} from "lucide-react";

const CREATE_JOURNAL_MODAL_ID = "create-journal-modal";
const CreateJournalModal = ({handleFormAction}:{handleFormAction: (formData: FormData) => void}) => {
    const [title, setTitle] = React.useState("");
    const [error, setError] = React.useState("");

    const handleInput = (input: string) => {
        setTitle(input)
        if(input.length > 50){
            setError("Title can't be more than 50 characters");
        }
        else {
            setError("");
        }
    }

    return (
        <Modal id={CREATE_JOURNAL_MODAL_ID}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create new journal</CardTitle>
                    <CardDescription>
                        Please input your journal title.
                    </CardDescription>
                    <Button variant={"ghost"}
                            onClick={() => {(document.getElementById(CREATE_JOURNAL_MODAL_ID)as HTMLDialogElement).close()}}
                            className={"absolute right-4 top-2"}
                    >
                        <XIcon/>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form action={handleFormAction}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Name of your journal..."
                                    required
                                    onChange={(e) => handleInput(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" name={title} className="w-full" disabled={!!error}>
                                Create
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Modal>
    );
};

export {CreateJournalModal, CREATE_JOURNAL_MODAL_ID};