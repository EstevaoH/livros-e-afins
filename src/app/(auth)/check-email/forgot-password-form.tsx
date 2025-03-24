"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertMessage } from "@/components/alertMessage";
import { forgotPasswrodInputs, forgotPasswrodSchema } from "./schema";
import axios from "axios";

export function ForgotPasswordForm() {
    const [message, setMessage] = useState<{ success: boolean; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<forgotPasswrodInputs>({
        resolver: zodResolver(forgotPasswrodSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: forgotPasswrodInputs) => {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/forgot-password", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                throw new Error("Erro ao enviar o link de recuperação.");
            }

            setMessage({ success: true, message: "Link de recuperação enviado com sucesso! Verifique seu e-mail." });
            form.reset();
        } catch (error: any) {
            console.error(error);
            setMessage({
                success: false,
                message: error.response?.data?.message || "Erro ao enviar o link de recuperação. Tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <>
            {message && (
                <AlertMessage
                    success={message.success}
                    message={message.message}
                />
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input placeholder="Seu e-mail" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Enviar link de Recuperação"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}