import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDeactivationModal from "./desactivate-account-modal";

export function DeleteAccount() {

    return (
        <Card className="border-red-200 bg-red-50">
            <CardHeader>
                <CardTitle className="text-red-600">Excluir Conta</CardTitle>
                <CardDescription className="text-red-600">
                    Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ConfirmDeactivationModal />
            </CardContent>
        </Card>
    )
}