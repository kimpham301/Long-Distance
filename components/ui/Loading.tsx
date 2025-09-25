import React from 'react';
import {LoaderCircle} from "lucide-react";
import {clsx} from "clsx";

const Loading = ({className}: {className?:string}) => {

    return (
        <span className={clsx("absolute right-[50%] animate-spin", className)}><LoaderCircle/></span>
    );
};

export default Loading;