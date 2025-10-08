'use client'

import {useSupabaseUpload} from "@/hooks/useUploadToBucket";
import {Dropzone, DropzoneContent, DropzoneEmptyState} from "@/components/ui/Dropzone";
import React, {useCallback} from "react";
import {createClient} from "@/lib/supabase/client";
import {useUserContext} from "@/components/user/UserContextWrapper";

const FileUploadAvatar = ({userId, closeModal} : {userId: string, closeModal: ()=> void}) => {
    const {changeAvatar} = useUserContext();

    const props = useSupabaseUpload({
        bucketName: 'avatar',
        fixedFileName: "avatar",
        path: userId,
        allowedMimeTypes: ['image/*'],
        maxFiles: 1,
        maxFileSize: 1000 * 1000 * 20, // 20MB,
        upsert: true,
    })

    const handleSetAvatar = useCallback(() => {
        const supabase= createClient()
        const {data: url} = supabase.storage.from("avatar").getPublicUrl(`${userId}/avatar`)
        if(url.publicUrl) {
            supabase.from("profiles").update({avatar_url: `${url.publicUrl}?t=${Date.now()}`}).eq("id", userId).then(() => {
                closeModal()
            })
            changeAvatar(url.publicUrl)
        }
        else{
            console.error("Could not upload avatar")
            closeModal()
        }
    }, [])

    return (
        <div className="w-[500px]">
            <Dropzone {...props}>
                <DropzoneEmptyState />
                <DropzoneContent isAvatar action={handleSetAvatar}/>
            </Dropzone>
        </div>
    )
}

export { FileUploadAvatar }
