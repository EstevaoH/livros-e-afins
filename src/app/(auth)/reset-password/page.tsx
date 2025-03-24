import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password-form";
import { Suspense } from "react";


export default function ResetPasswordPage() {
    return (
        <Suspense>
            <Card className="max-w-sm w-full rounded-2xl mt-12">
                <CardHeader>
                    <h2 className="text-xl font-bold">Redefinir Senha</h2>
                    <CardDescription>Digite sua nova senha.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm />
                </CardContent>
            </Card>
        </Suspense>
    );
}