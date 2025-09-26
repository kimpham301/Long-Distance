import Header from "@/components/ui/Header";

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <>
          <Header />
    <main className="h-[calc(100vh_-_64px)] flex flex-col items-center">
        <div className="flex-1 flex flex-col gap-5 w-full h-full pt-2 pb-4 px-2 md:px-8">
          {children}
        </div>
    </main>
      </>
  );
}
