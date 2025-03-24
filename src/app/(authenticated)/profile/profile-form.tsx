import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { AlertMessage } from "@/components/alertMessage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formProfileInputs, formProfileSchema } from "./schema";
import axios from "axios";
import { User } from "next-auth";

export default function ProfileForm() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ success: boolean; message: string } | null>(null);

    const form = useForm<formProfileInputs>({
        resolver: zodResolver(formProfileSchema),
        defaultValues: {
            email: '',
            lastName: '',
            name: '',
            username: '',
        },
    });

    const handleSetData = useCallback(
        (data: User) => {
            form.setValue("username", data.username!)
            form.setValue("name", data.name!)
            form.setValue("lastName", data.lastName!)
            form.setValue("email", data.email!)
        },
        [form]
    )
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        const getProfileData = async () => {
            if (!id) {
                setMessage({ success: false, message: "ID do usuário não fornecido." });
                return;
            }

            setIsLoading(true);
            await axios.get(`/api/profile?id=${id}`).then((response) => {
                console.log(response.data)
                if (response.data) {
                    handleSetData(response.data)
                }
            })
                .catch((error) => {
                    console.log(error)
                    setMessage({
                        success: false,
                        message: error.response?.data?.message || "Erro ao carregar perfil.",
                    });
                })
                .finally(() => setIsLoading(false));

        }
        getProfileData()
    }, [id, form]);

    const onSubmit = async (data: formProfileInputs) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`/api/profile?id=${id}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                throw new Error("Erro ao atualizar perfil.");
            }

            setMessage({ success: true, message: "Perfil atualizado com sucesso." });
        } catch (error: any) {
            console.error(error);
            setMessage({
                success: false,
                message: error.response?.data?.message || "Erro ao atualizar perfil. Tente novamente.",
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
            <Card>
                <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Atualize suas informações de contato.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Seu nome de usuário"
                                                {...field}
                                                disabled={isLoading}
                                                aria-describedby="username-description"
                                            />
                                        </FormControl>
                                        <FormDescription id="username-description">
                                            Este será o seu nome de exibição público.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Seu nome completo"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sobrenome</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Seu sobrenome"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="email@exemplo.com"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-center">
                                <Button
                                    className="w-1/3 mt-6"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}