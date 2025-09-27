import React from 'react';
import Header from "@/components/ui/Header";

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Header />
            <main className="h-[calc(100vh_-_70px)] flex flex-col items-center">
                <div className="flex-1 flex flex-col gap-5 w-full h-full pb-4 px-2 md:px-8">
                    {children}
                </div>
            </main>
        </>
    );
};

export default Layout;