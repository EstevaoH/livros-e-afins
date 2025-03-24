"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema, BookInputs } from "./schema";
import axios from "axios";
import { useEffect, useState } from "react";
import { AlertMessage } from "@/components/alertMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import { Rating } from '@smastrom/react-rating'
import MultiSelect from 'react-select'

const genres = [
    { value: "Fantasy", label: "Fantasia" },
    { value: "Fiction", label: "Ficção" },
    { value: "Science Fiction", label: "Ficção Científica" },
    { value: "Dystopian", label: "Distopia" },
    { value: "Adventure", label: "Aventura" },
    { value: "Romance", label: "Romance" },
    { value: "Mystery", label: "Mistério" },
    { value: "Horror", label: "Horror" },
    { value: "Thriller", label: "Thriller" },
    { value: "Historical", label: "Histórico" },
    { value: "Biography", label: "Biografia" },
    { value: "Self-Help", label: "Autoajuda" },
    { value: "Poetry", label: "Poesia" },
    { value: "Children's", label: "Infantil" },
    { value: "Young Adult", label: "Juvenil" },
    { value: "Graphic Novel", label: "Graphic Novel" },
    { value: "Business", label: "Negócios" },
    { value: "Technology", label: "Tecnologia" },
    { value: "Philosophy", label: "Filosofia" },
    { value: "Religion", label: "Religião" },
    { value: "Art", label: "Arte" },
];

const languages = [
    { name: "Português", flag: "br" },
    { name: "Inglês", flag: "gb" },
    { name: "Espanhol", flag: "es" },
    { name: "Francês", flag: "fr" },
    { name: "Alemão", flag: "de" },
    { name: "Italiano", flag: "it" },
    { name: "Chinês", flag: "cn" },
    { name: "Japonês", flag: "jp" },
    { name: "Russo", flag: "ru" },
    { name: "Árabe", flag: "sa" },
];

export default function NewBookForm() {
    const [message, setMessage] = useState<{ success: boolean; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [rating, setRating] = useState(3);

    const form = useForm<BookInputs>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            author: '',
            description: '',
            genre: [""],
            image: '',
            isbn: '',
            language: '',
            pages: 0,
            priority: '',
            publishedDate: '',
            publisher: '',
            rating: 0,
            status: '',
            title: '',
            startReadingDate: '',
            endReadingDate: '',
        }
    });
    const fetchBookData = async (isbn: string) => {
        setIsFetching(true);
        try {
            const basicResponse = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`);
            const basicData = basicResponse.data;

            const apiGenres = basicData.subjects || [];
            console.log(apiGenres)
            const mappedGenres = apiGenres.map((genre: string) => ({
                value: genre,
                label: genre,
            }));

            form.setValue("title", basicData.title || "");
            form.setValue("author", basicData.by_statement || "");
            form.setValue("description", basicData.description || "");
            form.setValue("publishedDate", basicData.publish_date || "");
            form.setValue("publisher", basicData.publishers?.[0] || "");
            form.setValue("pages", basicData.number_of_pages || 0);
            form.setValue("language", basicData.languages?.[0]?.key || "");
            form.setValue("image", `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
            // form.setValue("genre", mappedGenres.map((g: any) => g.value));

            setMessage({ success: true, message: "Dados do livro carregados com sucesso!" });
        } catch (error) {
            console.error("Erro ao buscar dados do livro:", error);
            setMessage({ success: false, message: "Erro ao buscar dados do livro. Verifique o ISBN e tente novamente." });
        } finally {
            setIsFetching(false);
        }
    };

    const onSubmit = async (data: BookInputs) => {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/books", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 201) {
                throw new Error("Erro ao cadastrar o livro.");
            }

            setMessage({ success: true, message: "Livro cadastrado com sucesso!" });
            form.reset();
        } catch (error: any) {
            console.error(error);
            setMessage({
                success: false,
                message: error.response?.data?.message || "Erro ao cadastrar o livro. Tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const publishedDate = form.watch("publishedDate");
    const statuReading = form.watch("status");
    const maxPages = form.watch("pages")
    useEffect(() => {
        const imageUrl = form.watch("image");
        if (imageUrl) {
            setImagePreview(imageUrl);
        } else {
            setImagePreview(null);
        }
    }, [form.watch("image")]);
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Livro</h1>
            {message && (
                <AlertMessage
                    success={message.success}
                    message={message.message}
                />
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="isbn"
                        render={({ field }) => {
                            const isbnValue = field.value;
                            const isButtonDisabled = !isbnValue || isFetching;

                            return (
                                <FormItem className="flex-1">
                                    <FormLabel>ISBN</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Busque o livro pelo ISBN" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <Button
                                        type="button"
                                        onClick={async () => {
                                            const isValid = await form.trigger("isbn");
                                            if (isValid) {
                                                fetchBookData(form.getValues("isbn"));
                                            }
                                        }}
                                        disabled={isButtonDisabled}
                                        className=""
                                    >
                                        {isFetching ? "Buscando..." : "Buscar"}
                                    </Button>
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o título do livro" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Autor</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o nome do autor" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} placeholder="Digite uma breve descrição do livro" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="publishedDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data de Publicação</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {publishedDate ? format(new Date(publishedDate), "dd/MM/yyyy") : "Selecione a data"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={publishedDate ? new Date(publishedDate) : undefined}
                                                onSelect={(date) => form.setValue("publishedDate", date?.toISOString() || "")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prioridade</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a prioridade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="alta">Alta</SelectItem>
                                            <SelectItem value="média">Média</SelectItem>
                                            <SelectItem value="baixa">Baixa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Avaliação</FormLabel>
                                <FormControl>
                                    <Rating
                                        style={{ maxWidth: 100 }}
                                        value={field.value || 0}
                                        onChange={(value: any) => {
                                            field.onChange(value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Imagem da Capa</FormLabel>
                                {imagePreview && (
                                    <div className="mt-2 mb-4">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview da capa do livro"
                                            width={150}
                                            height={200}
                                            className="rounded-lg border"
                                        />
                                    </div>
                                )}
                                <FormControl>
                                    <Input
                                        placeholder="Digite a URL da imagem da capa"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setImagePreview(e.target.value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <FormField
                                        control={form.control}
                                        name="genre"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gênero</FormLabel>
                                                <FormControl>
                                                    <MultiSelect
                                                        options={genres}
                                                        isMulti
                                                        placeholder="Selecione os gêneros"
                                                        value={genres.filter((genre) => field.value?.includes(genre.value))}
                                                        onChange={(selected) => {
                                                            field.onChange(selected ? selected.map((option) => option.value) : []);
                                                        }}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* <Input
                                        {...field}

                                    /> */}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pages"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Páginas</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Digite o número de páginas"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Idioma</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o idioma" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languages.map((language) => (
                                                <SelectItem key={language.name} value={language.name}>
                                                    <div className="flex items-center gap-2">
                                                        <Image
                                                            src={`/flags/${language.flag}.svg`}
                                                            width={15}
                                                            height={15}
                                                            alt={language.name}
                                                            className="w-5 h-5"
                                                        />
                                                        <span>{language.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="publisher"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Editora</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite a editora do livro" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notas</FormLabel>
                                <FormControl>
                                    <Textarea rows={2} maxLength={150} placeholder="Escreva um nota sobre..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="read">Lido</SelectItem>
                                            <SelectItem value="to-read">Para Ler</SelectItem>
                                            <SelectItem value="reading">Lendo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {statuReading === "reading" && (
                        <>

                            <FormField
                                control={form.control}
                                name="startReadingDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Início da Leitura</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start text-left font-normal"
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(new Date(field.value), "dd/MM/yyyy") : "Selecione a data"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date?.toISOString() || "")}
                                                        disabled={(date) => date > new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currentPages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Página atual</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={maxPages}
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    {statuReading === "read" && (
                        <>
                            <FormField
                                control={form.control}
                                name="startReadingDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Início da Leitura</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start text-left font-normal"
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(new Date(field.value), "dd/MM/yyyy") : "Selecione a data"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date?.toISOString() || "")}
                                                        disabled={(date) => date > new Date()} // Desabilita datas futuras
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endReadingDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Término da Leitura</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start text-left font-normal"
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(new Date(field.value), "dd/MM/yyyy") : "Selecione a data"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date?.toISOString() || "")}
                                                        disabled={(date) => date > new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Cadastrando..." : "Cadastrar Livro"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}