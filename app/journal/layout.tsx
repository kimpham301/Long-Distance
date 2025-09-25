export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen flex flex-col items-center">
        <div className="flex-1 flex flex-col gap-5 w-full h-[calc(100%_-_80px)] pt-2 pb-4 px-8">
          {children}
        </div>
    </main>
  );
}
