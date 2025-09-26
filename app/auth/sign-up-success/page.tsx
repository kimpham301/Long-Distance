import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {LoginForm} from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex h-[calc(100vh_-_88px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Thank you for signing up!
              </CardTitle>
            </CardHeader>
            <CardContent>
             <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
