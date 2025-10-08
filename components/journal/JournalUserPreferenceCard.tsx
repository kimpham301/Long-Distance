'use client'
import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import Form from "next/form";
import {createClient} from "@/lib/supabase/client";
import {useParams, useRouter} from "next/navigation";
import {UserPrefWithProfile} from "@/components/journal/JournalInfo";
import {Label} from "@/components/ui/label";
import Loading from "@/components/ui/Loading";
import {Button} from "@/components/ui/button";

const colors = [
    { name: "primary", value: "bg-primary" },
    { name: "orange", value: "bg-orange-400" },
    { name: "emerald", value: "bg-emerald-700" },
    { name: "gray", value: "bg-gray-700" },
];

const JournalUserPreferenceCard = ({user, existingProfiles}: {user: {id: string, username?: string | null, email?: string | null}, existingProfiles: UserPrefWithProfile[]}) => {
    const params = useParams<{journalId: string}>()
    const router = useRouter();
    const notUsedColor = colors.filter(c => !existingProfiles.some(p => p.color === c.value ))
    const [selected, setSelected] = React.useState<string>(notUsedColor[0].value);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const createProfile = (formData: FormData) => {
        setLoading(true);
        const supabase = createClient()
        const displayName = formData.get("name") as string
        supabase.from("journal_user_preference").insert({display_name: displayName, journal_id: params.journalId, user_id: user.id, color: selected.split("-").slice(1).join("-")})
            .then((result) => {
                if (result.error) {
                    setLoading(false);
                    console.error(result.error);
                    setError("Error creating profile");
                }
                else {
                    setLoading(false)
                    router.refresh()
                }

            })
    }
    return (
        <Card className={"w-full md:w-1/2 relative"}>
            {loading && <Loading className={"mt-16"} />}
            <CardHeader>
                <CardTitle>
                    Set up
                </CardTitle>
                <CardDescription>
                    Please fill out your profile in the journal
                </CardDescription>
            </CardHeader>

            <CardContent>
                    <Form action={createProfile}>
                        <Label htmlFor={"name"}>Display name</Label>
                    <Input className={"mb-3"} id={"name"} name={"name"} defaultValue={user?.username ?? undefined} placeholder={"Input your display name on this journal"}/>
                        <Label>
                            Select your color
                        </Label>
                        <div className={"flex flex-row"}>
                        {colors.map((color) => {
                            return (
                            <label
                                key={color.value}
                                className="relative cursor-pointer mt-2 mr-2"
                            >
                                <input
                                    type="radio"
                                    name="color"
                                    value={color.value}
                                    checked={selected === color.value}
                                    onChange={() => setSelected(color.value)}
                                    className="sr-only"
                                />
                                <div
                                    className={`w-8 h-8 rounded-full border border-gray-300 shadow-sm transition 
              ${selected === (color.value) ? "ring-2 ring-offset-2 ring-gray-600" : ""} ${color.value}`}
                                />
                            </label>
                        )}
                        )}
                        </div>
                        <div className={'flex justify-end'}>
                        <Button type={"submit"}>Submit</Button>
                        </div>
                    </Form>
                    {error && <div className={"text-error"}>{error}</div>}
                </CardContent>
        </Card>
    );
};

export default JournalUserPreferenceCard;