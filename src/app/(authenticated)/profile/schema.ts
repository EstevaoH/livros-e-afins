import { z } from "zod"

const passwordValidation = (value: string) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};


export const formProfileSchema = z.object({
    username: z.string().min(2, { message: "Username deve conter pelo menos dois caracteres." }).max(50),
    name: z.string().trim().pipe(z.string().min(3, { message: 'O campo nome deve conter pelo menos 3 caracteres.' })),
    lastName: z.string().trim().pipe(z.string().min(3, { message: 'O campo sobrenome deve conter pelo menos 3 caracteres.' })),
    email: z.string().email({ message: 'Insira um e-mail válido.' }),
})

export type formProfileInputs = z.infer<typeof formProfileSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z.string()
        .min(8, { message: 'A senha atual deve ter pelo menos 8 caracteres.' })
        .refine(passwordValidation, {
            message: 'A senha atual deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.',
        }),
    newPassword: z.string()
        .min(8, { message: 'A nova senha deve ter pelo menos 8 caracteres.' })
        .refine(passwordValidation, {
            message: 'A nova senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.',
        }),
    confirmPassword: z.string(),
})
    .refine((values) => values.newPassword === values.confirmPassword, {
        message: 'As senhas devem ser iguais!',
        path: ['confirmPassword'],
    })
export type changePasswordInputs = z.infer<typeof changePasswordSchema>

export const desactiveAccountSchema = z.object({
    desactiveAccountCode: z.string(),
})
export type desactiveAccountInputs = z.infer<typeof desactiveAccountSchema>