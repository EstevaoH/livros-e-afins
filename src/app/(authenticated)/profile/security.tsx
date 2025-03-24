import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordModal } from "./change-password-modal";

export function Security() {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>Proteja sua conta com senha forte e autenticação de dois fatores.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ChangePasswordModal />
                </CardContent>
            </Card>
        </>
    )
}