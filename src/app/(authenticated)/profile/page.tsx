"use client";
import ProfileForm from "./profile-form";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Security } from "./security";
import { Preferences } from "./preferences";
import { DeleteAccount } from "./delete-account";

export default function ProfilePage() {
    const { theme, setTheme } = useTheme();


    return (
        <>
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Perfil</h1>
                    <p className="text-gray-600 dark:text-gray-50">
                        Gerencie suas informações pessoais, segurança e preferências.
                    </p>
                </div>
                <ProfileForm />
                <Security />
                <Preferences userTheme={theme!} />
                <DeleteAccount />
            </div>
        </>
    );
}