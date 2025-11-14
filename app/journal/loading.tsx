import React from 'react';
import Loading from "@/components/ui/Loading";

const LoadingOuterJournal = () => {
    return (
        <div className={"text-center"}>
            <Loading />
            <div className={"mt-8 mr-8"}>Checking for journals...</div></div>
    );
};

export default LoadingOuterJournal;