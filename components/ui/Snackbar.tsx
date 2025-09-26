"use client"
import React, {useEffect} from 'react';
import Modal from "@/components/ui/Modal";
import {clsx} from "clsx";

const SNACKBAR_ID = "snackbar";
const Snackbar = ({message, type, onClose}:    {message: string, type: "success" | "error", onClose: () => void}) => {

    useEffect(() => {
        const timerId = setTimeout(() => {onClose()}, 2500);
        return () => {
            clearTimeout(timerId);
        }
    }, [onClose]);

    let typeStyle
    if(type === "success") {
        typeStyle = "bg-success text-success-foreground"
    }
    if(type === "error") {
        typeStyle = "bg-error text-error-foreground"
    }
    return (
        <Modal open id={SNACKBAR_ID} className={clsx("bottom-10 bg px-4 py-3 rounded text-center", typeStyle)}>
            {message}
        </Modal>
    );
};

export {SNACKBAR_ID, Snackbar};