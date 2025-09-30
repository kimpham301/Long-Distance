"use client"
import React, {useEffect} from 'react';
import {UPLOAD_AVATAR_MODAL, UploadAvatarModal} from "@/components/user/UploadAvatarModal";
import {Upload, UserRoundIcon} from "lucide-react";
import { Button } from '../ui/button';
import Image from "next/image";
import {useUserContext} from "@/components/UserContextWrapper";

const UserAvatar = () => {
    const {profile, authId} = useUserContext()
    const [openAvatar, setOpenAvatar] = React.useState(false);

    useEffect(() => {
        if(openAvatar){
            (document.getElementById(UPLOAD_AVATAR_MODAL)as HTMLDialogElement).showModal();
    }},[openAvatar])

    const getInitials = (name: string | null) => {
        return name ? name.split(' ').map(name => name[0]).join('') : "N/A";
    }

    const closeModal = () => {
        setOpenAvatar(false)
    }

    return (
        <>
        <span className={"rounded-full bg-muted w-24 h-24 relative flex shrink-0"}>{profile?.avatar_url
            ? (<Image className={"aspect-square h-full w-full rounded-full"}
                      src={profile?.avatar_url}
                      width={100}
                      height={100}
                      alt={getInitials(profile?.username)}/>
            )
            : <UserRoundIcon className={'m-auto w-12 h-12'}/>}
            {profile?.id === authId && <Button className={"w-6 h-8 rounded-full absolute bottom-0 right-0"}
                                               onClick={() => {
                        setOpenAvatar(true)}}>
                    <Upload/>
                </Button>}
            </span>
            {openAvatar && <UploadAvatarModal closeModal={closeModal}/>}
        </>
    );
};

export default UserAvatar;