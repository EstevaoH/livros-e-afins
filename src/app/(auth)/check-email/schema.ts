import { z } from "zod"
export const forgotPasswrodSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'O e-mail é obrigatório.' })
        .email({ message: 'Por favor, insira um e-mail válido.' }),
});

export type forgotPasswrodInputs = z.infer<typeof forgotPasswrodSchema>;