'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { User, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function Navbar({ userName, id }: { userName: string | null | undefined, id: string | null | undefined }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-50 shadow-sm dark:bg-neutral-950 dark:border-b dark:shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            {/* <Logo /> */}
          </Link>
        </div>

        <Collapsible open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <div className="flex items-center space-x-4">
            <CollapsibleTrigger asChild className="lg:hidden">
              <button className="text-gray-700 hover:text-gray-900 dark:hover:text-gray-50">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </CollapsibleTrigger>
            <nav className="hidden lg:flex lg:items-center lg:space-x-4">
              <Link
                href={`/my-library`}
                className="text-gray-700 hover:text-gray-900"
              >
                <Button
                  variant={'link'}
                  className={cn(
                    pathname === `/my-library` ? 'underline' : ''
                  )}
                >
                  Minha Biblioteca
                </Button>
              </Link>
              <Link href="/new-book" className="text-gray-700 hover:text-gray-900">
                <Button
                  variant={'link'}
                  className={cn(pathname === '/new-book' ? 'underline' : '')}
                >
                  Adicionar Novo Livro
                </Button>
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                <Button
                  variant={'link'}
                  className={cn(pathname === '/dashboard' ? 'underline' : '')}
                >
                  Ver Estatísticas de Leitura
                </Button>
              </Link>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-700 hover:text-gray-900 dark:hover:text-gray-50">
                  <User size={24} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4">
                <Link href={`/profile?id=${id}`}>
                  <DropdownMenuLabel className="font-light text-xs cursor-pointer">
                    {userName}
                  </DropdownMenuLabel>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button className="cursor-pointer" onClick={() => signOut({ callbackUrl: '/login' })}>
                    Encerrar Sessão
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CollapsibleContent className="lg:hidden">
            <nav className="flex flex-col space-y-2 mt-4">
              <Link
                href={`/my-library`}
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant={'link'}
                  className={cn(
                    pathname === `/my-library` ? 'underline' : ''
                  )}
                >
                  Minha Biblioteca
                </Button>
              </Link>
              <Link
                href="/new-book"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant={'link'}
                  className={cn(pathname === '/new-book' ? 'underline' : '')}
                >
                  Adicionar Novo Livro
                </Button>
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant={'link'}
                  className={cn(pathname === '/dashboard' ? 'underline' : '')}
                >
                  Ver Estatísticas de Leitura
                </Button>
              </Link>
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </header>
  );
}