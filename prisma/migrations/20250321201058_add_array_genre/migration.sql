/*
  Warnings:

  - You are about to alter the column `genre` on the `books` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT,
    "publishedDate" DATETIME NOT NULL,
    "isbn" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "priority" TEXT,
    "rating" INTEGER,
    "image" TEXT,
    "genre" JSONB,
    "pages" INTEGER,
    "language" TEXT,
    "publisher" TEXT,
    "status" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "notes" TEXT,
    "daysToRead" INTEGER,
    CONSTRAINT "books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_books" ("author", "createdAt", "daysToRead", "description", "endDate", "genre", "id", "image", "isbn", "language", "notes", "pages", "priority", "publishedDate", "publisher", "rating", "startDate", "status", "title", "updatedAt", "userId") SELECT "author", "createdAt", "daysToRead", "description", "endDate", "genre", "id", "image", "isbn", "language", "notes", "pages", "priority", "publishedDate", "publisher", "rating", "startDate", "status", "title", "updatedAt", "userId" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
