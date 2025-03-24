import { AlertMessage } from "@/components/alertMessage";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialogCancel, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { desactiveAccountInputs, desactiveAccountSchema } from "./schema";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function ConfirmDeactivationModal() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ success: boolean; message: string } | null>(null);
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const form = useForm<desactiveAccountInputs>({
        resolver: zodResolver(desactiveAccountSchema),
        defaultValues: {
            desactiveAccountCode: "",
        },
    });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const onSubmit = async (data: desactiveAccountInputs) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`/api/delete-account?id=${id}`, {
                data: { password: data.desactiveAccountCode },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                throw new Error("Erro ao desativar a conta.");
            }

            setMessage({ success: true, message: "Conta desativada com sucesso." });
            setTimeout(() => {
                signOut({ callbackUrl: "/" });
            }, 2000);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage({
                    success: false,
                    message: error.response?.data?.message || "Erro ao desativar a conta. Tente novamente.",
                });
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Desativar Conta</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Desativar Conta</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza de que deseja desativar sua conta? Esta ação é irreversível e todos os seus dados serão permanentemente removidos. Para confirmar, insira sua senha atual.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {message && (
                    <AlertMessage
                        success={message.success}
                        message={message.message}
                    />
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="desactiveAccountCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha Atual</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="password"
                                                placeholder="Digite sua senha atual"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <Button variant={'destructive'} type="submit" disabled={isLoading}>
                                {isLoading ? "Desativando..." : "Desativar Conta"}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}