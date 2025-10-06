import React from 'react';
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";

const Drawer = ({children, direction = "left", handleClose, open, className}:
                {children: React.ReactNode,
                    direction: "right" | "left" ,
                    open:boolean,
                    handleClose: () => void,
                    className?: string}) => {
    const position = direction === "left" ? "left-0" : "right-0";
    const transitionStart = direction === "left" ? "translate-x-0" : "translate-x-0";
    const transitionEnd = direction === "left" ?  "-translate-x-full" : "translate-x-full" ;
    const btnPosition = direction === "left" ? "right-0" : "left-0";

    return (
        <div className={`z-40 fixed top-0 ${position} w-64 h-full bg-background shadow-lg transition-transform transform ${open ? transitionStart : transitionEnd} ${className}`}>
            {open && <div className={"p-4 pt-16 relative"}>
                <Button className={`absolute ${btnPosition} top-2`} variant={"ghost"} onClick={handleClose}><X /></Button>
                {children}
            </div>}
        </div>
    );
};

export default Drawer;