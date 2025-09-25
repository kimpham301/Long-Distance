import React from 'react';
import {Button} from "@/components/ui/button";
import {MenuIcon} from "lucide-react";

const MobileUserMenuButton = () => {
    return (
        <Button variant={"ghost"}>
            <MenuIcon/>
        </Button>
    );
};

export default MobileUserMenuButton;