"use client"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image"
import { LoginForm } from "./login-form";
import Logo from "../../../../public/logo.png"

export default function LoginPage() {
  return (
    <>
      <Image src={Logo} alt='' width={300} height={300} />
      <Card className="max-w-sm w-full rounded-2xl mt-12">
        <CardHeader>
          <h2 className="text-xl font-bold">Boas Vindas</h2>
          <CardDescription>Faça seu login com email e senha.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground mt-3">
        Não possui cadastro?{' '}
        <Link className="text-gray-800 hover:underline" href="/register">
          Registre-se
        </Link>
        .
      </p>
    </>
  );
}