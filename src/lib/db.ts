import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';


declare global {
  var prisma: PrismaClient | undefined;
}

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

// Configuração do cliente LibSQL (Turso)
const libsql = createClient({
  url: "libsql://livros-e-afins-estevaoh.turso.io"!, // URL do banco de dados Turso
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDE5OTQ5OTUsImlkIjoiOTJhOGFjZmQtNjkwMi00MTg0LWFhZDktMDcxMGI2YmQxZTAxIn0.1SIarf0DInBghv6-3Q2YPLAoI0IKsdKh1FsOE7mN3GPTWkqTz92VBkf1cQfeXyHNFefS0gmzG4tyX3ZxqxxwCw"});

// Adaptador do Prisma para LibSQL
const adapter = new PrismaLibSQL(libsql);

// Criação do PrismaClient com o adaptador do Turso
const db = globalThis.prisma || new PrismaClient({ adapter });

// Evita a criação de múltiplas instâncias do PrismaClient em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export default db;