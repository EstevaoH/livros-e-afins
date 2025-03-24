import { Book } from "@prisma/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const progressSchema = z.object({
    currentPage: z.number().min(1, "A página atual deve ser pelo menos 1."),
});

type ProgressInputs = z.infer<typeof progressSchema>;

export default function UpdateReadingModal({ book, onUpdateProgress }: { book: Book; onUpdateProgress: (currentPage: number) => void }) {
    const form = useForm<ProgressInputs>({
        resolver: zodResolver(progressSchema),
        defaultValues: {
            currentPage: book.currentPages || 1,
        },
    });

    const onSubmit = (data: ProgressInputs) => {
        onUpdateProgress(data.currentPage);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Atualizar progresso</Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentPage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Página atual</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={book.pages || 1}
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Atualizar progresso
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    );
}