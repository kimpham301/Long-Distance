"use client"
import React from 'react';
import Modal from "@/components/ui/Modal";
import {FileUploadAvatar} from "@/components/ui/FileUploadDropDown";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {XIcon} from "lucide-react";

const UPLOAD_AVATAR_MODAL = "upload_avatar_modal"
const UploadAvatarModal = ({closeModal}: {closeModal: () => void}) => {
    const {userId} = useParams()
    if(!userId){
        return null
    }
    return (
        <Modal id={UPLOAD_AVATAR_MODAL}>
            <Card>
                <CardHeader>
                   <CardTitle> Upload Profile Picture</CardTitle>
                    <Button variant={"ghost"}
                            onClick={() => {
                                (document.getElementById(UPLOAD_AVATAR_MODAL)as HTMLDialogElement).close();
                                closeModal();
                            }}
                            className={"absolute right-4 top-2"}
                    >
                        <XIcon/>
                    </Button>
                </CardHeader>
                <CardContent className={"flex justify-center"}>
            <FileUploadAvatar userId={userId as string} closeModal={closeModal} />
                </CardContent>
            </Card>
        </Modal>
    );
};

export {UPLOAD_AVATAR_MODAL, UploadAvatarModal};