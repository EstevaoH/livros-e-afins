import { z } from "zod";

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});

export type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;