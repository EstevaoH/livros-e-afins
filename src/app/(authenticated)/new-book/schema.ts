import { z } from "zod";

export const bookSchema = z.object({
    title: z.string().min(1, "O título é obrigatório."),
    author: z.string().min(1, "O autor é obrigatório."),
    isbn: z.string().min(1, "O ISBN é obrigatório."),
    description: z.string().optional(),
    publishedDate: z.string().optional(),
    priority: z.string().optional(),
    rating: z.number().optional(),
    image: z.string().optional(),
    genre: z.array(z.string()).optional(),
    pages: z.number().optional(),
    language: z.string().optional(),
    publisher: z.string().optional(),
    status: z.string().optional(),
    currentPages: z.number().min(1, "A página atual deve ser pelo menos 1.").optional(),
    notes: z.string().max(150, "Suas anotações não podem ter mais de 150 caracteres").optional(),
    startReadingDate: z
        .string()
        .optional()
        .refine((date) => {
            if (!date) return true;
            const selectedDate = new Date(date);
            const today = new Date();
            return selectedDate <= today;
        }, "A data de início da leitura não pode ser futura."),
    endReadingDate: z
        .string()
        .optional()
        .refine((date) => {
            if (!date) return true;
            const selectedDate = new Date(date);
            const today = new Date();
            return selectedDate <= today;
        }, "A data de término da leitura não pode ser futura."),
});

export type BookInputs = z.infer<typeof bookSchema>;