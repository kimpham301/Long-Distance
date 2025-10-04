"use client"
import React from 'react';
import {Button} from "@/components/ui/button";
import {MenuIcon} from "lucide-react";
import Drawer from "@/components/ui/Drawer";

const MobileUserMenuButton = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
        <Button variant={"ghost"} onClick={() => {setOpen(!open);}}>
            <MenuIcon/>
        </Button>
            <Drawer direction={"right"} open={open} handleClose={() => setOpen(false)}><div>Something</div></Drawer>
            </>
    );
};

export default MobileUserMenuButton;