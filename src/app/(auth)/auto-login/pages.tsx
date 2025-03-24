// 'use client';

// import { useEffect } from 'react';
// import { signIn } from 'next-auth/react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { CheckCircle, Loader2 } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

// export default function AutoLoginPage() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const email = searchParams.get('email');
//     const password = searchParams.get('password');

//     useEffect(() => {
//         if (email && password) {
//             signIn('credentials', {
//                 email: email,
//                 password: password,
//                 redirect: false,
//             }).then((response) => {
//                 console.log(response);
//                 if (response?.error) {
//                     if (response.error === 'CredentialsSignin') {
//                         console.log('Erro ao fazer auto-login:', response.error);
//                         console.log(response);
//                         console.log(email);
//                         router.push('/login');
//                     }
//                 } else {
//                     router.push('/dashboard');
//                 }
//             });
//         } else {
//             router.push('/login');
//         }
//     }, [email, password, router]);

//     return (
//         <>
//             <Card className="max-w-sm w-full rounded-2xl shadow-lg">
//                 <CardHeader className="text-center">
//                     <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
//                         <CheckCircle className="h-8 w-8 text-green-600" />
//                     </div>
//                     <h2 className="mt-4 text-xl font-bold text-gray-800">Cadastro concluído!</h2>
//                     <CardDescription className="mt-2 text-gray-600">
//                         Seu cadastro foi realizado com sucesso.
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center">
//                     <p className="mt-4 text-gray-600">
//                         Estamos conectando você à sua conta. Aguarde um momento...
//                     </p>
//                     <div className="mt-6 flex justify-center">
//                         <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
//                     </div>
//                 </CardContent>
//             </Card>
//         </>
//     );
// }