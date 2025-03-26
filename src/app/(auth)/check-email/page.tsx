import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { ForgotPasswordForm } from "./forgot-password-form";
import Link from "next/link";
import Image from "next/image"
import Logo from "../../../../public/logo.png"

export default function CheckEmailPage() {
    return (
        <>
            <Image src={Logo} alt='' width={300} height={300} />
            <Card className="max-w-sm w-full rounded-2xl mt-12">
                <CardHeader>
                    <h2 className="text-xl font-bold">Recuperação de Senha</h2>
                    <CardDescription>Digite seu email para receber um link de recuperação.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ForgotPasswordForm />
                </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground mt-3">
                <Link className="text-gray-800 hover:underline" href="/login">
                    Voltar
                </Link>
            </p>
        </>
    );
}