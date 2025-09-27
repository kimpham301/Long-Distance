"use client"
import React from 'react';
import {Button} from "@/components/ui/button";
import {Edit2, SaveIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {createClient} from "@/lib/supabase/client";
import Loading from "@/components/ui/Loading";
import {useUserContext} from "@/components/UserContextWrapper";
import {useParams} from "next/navigation";

const UserDisplayNameEditor = () => {
    const {profile, changeUsername, authId} = useUserContext()
    const {userId} = useParams();
    const supabase = createClient()
    const [isEditing, setIsEditing] = React.useState(false);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(profile?.username ?? "");

    if(authId !== userId) {
        return <p
            className={`${!profile?.username ? "text-muted-foreground italic" : ""}`}>{profile?.username || "N/A"}</p>

    }
    const handleEdit = () => {
        setIsEditing(true);
    }

    const cancel = () => {
        if (!loading) {
            setIsEditing(false);
            setInputValue(profile?.username ?? "")
        }
    }

    const closeEdit = async () => {
        if(inputValue === profile?.username) {
            setIsEditing(false);
        }
        else {
            setLoading(true)
            const updatedValue = await supabase.from("profiles").update({username: inputValue}).eq("id", userId as string ?? "").select("username").single()
            if (updatedValue.error) {
                console.error(updatedValue.error)
                setError("Something went wrong")
                setLoading(false)
            } else if (updatedValue.data.username) {
                changeUsername(updatedValue.data.username)
                setLoading(false)
                setIsEditing(false);
            }
        }

    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 15) {
            setError("Name must be less than 15.");
        } else {
            setInputValue(e.target.value);
            setError("")
        }
    }
    return (
        <div className={"flex items-center relative mr-[-16px]"}>
            {isEditing
                ? (<Input
                    value={inputValue}
                    onBlur={cancel}
                    className={"border-muted-foreground h-full"}
                    autoFocus={true}
                    onChange={handleInputChange}
                    name={"display-name"}
                />)
                :
                <p className={`${!profile?.username ? "text-muted-foreground italic" : ""}`}>{profile?.username || "N/A"}</p>
            }
            {error && <span className={"absolute top-9 text-error-foreground text-xs"}>{error}</span>}
            {loading && <Loading className={"top-2"}/>}
            {isEditing
                ? <Button
                    id={"save-btn"}
                    variant={"ghost"}
                    onMouseDown={closeEdit}
                >
                    <SaveIcon/>
                </Button>
                : <Button variant={"ghost"} onClick={handleEdit}><Edit2/></Button>}
        </div>
    );
};

export default UserDisplayNameEditor;