"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInputs } from "./schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertMessage } from "@/components/alertMessage";
import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export function ResetPasswordForm() {
    const [message, setMessage] = useState<{ success: boolean; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // Obtém o token da URL

    const form = useForm<ResetPasswordInputs>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordInputs) => {
        setIsLoading(true);
        try {
            // Envia a nova senha e o token para a API
            const response = await axios.post("/api/reset-password", {
                token,
                newPassword: data.newPassword,
            });

            if (response.status !== 200) {
                throw new Error("Erro ao redefinir a senha.");
            }

            // Exibe uma mensagem de sucesso
            setMessage({ success: true, message: "Senha redefinida com sucesso!" });
            form.reset(); // Limpa o formulário após a redefinição
        } catch (error: any) {
            console.error(error);
            // Exibe uma mensagem de erro
            setMessage({
                success: false,
                message: error.response?.data?.message || "Erro ao redefinir a senha. Tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
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
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nova Senha</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Digite sua nova senha"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar Senha</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Confirme sua nova senha"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                    </Button>
                </form>
            </Form>
        </>
    );
}