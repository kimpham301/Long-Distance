import React from 'react';
import {clsx} from "clsx";

const Modal = ({open, id, className, children}: {open?: boolean, id: string, className?: string, children: React.ReactNode}) => {
    return (
        <dialog open={open} id={id} className={clsx("md:w-[40vw] w-full backdrop:bg-backdrop rounded-xl", className)}>
            {children}
        </dialog>
    );
};

export default Modal;