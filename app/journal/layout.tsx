import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen flex flex-col items-center">
      <div className="flex-1 h-full w-full flex flex-col gap-2 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full flex justify-between items-center p-8 text-sm">
            <div className="flex gap-5 items-center font-semibold text-xl text-primary">
              Long Distance
            </div>
            <div className={"flex gap-3 items-center"}>
              <ThemeSwitcher />
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-5 w-full h-[calc(100%_-_80px)] pt-2 pb-4 px-8">
          {children}
        </div>
      </div>
    </main>
  );
}
