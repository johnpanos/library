import { z, ZodError } from "zod";
import type { Book, BookWithAvailableCopies } from "../models/Book.ts";
import type { BookRepository } from "@/data/BookRepository.ts";
import type { Result } from "@/types.ts";

type CreateBookArgs = {
  title?: string;
  author?: string;
  isbn?: string;
  copies?: number;
};

const CreateBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  isbn: z.string().and(z.string().length(10).or(z.string().length(13))),
  copies: z.number().min(1),
});

export class BookService {
  private bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  public createBook(bookArgs: CreateBookArgs): Result<Book, ZodError | Error> {
    const { data, error, success } = CreateBookSchema.safeParse(bookArgs);

    if (!success) {
      return { ok: false, error };
    }

    const existingBook = this.bookRepository.findByIsbn(data.isbn);

    if (existingBook) {
      return {
        ok: false,
        error: new Error(`Book with the ISBN ${bookArgs.isbn} already exists`),
      };
    }

    const book = this.bookRepository.insert(data);

    return {
      ok: true,
      value: book,
    };
  }

  public getBook(isbn: string): Book | undefined {
    return this.bookRepository.findByIsbn(isbn);
  }

  public getBookWithAvailableCopies(
    isbn: string,
  ): BookWithAvailableCopies | undefined {
    const book = this.getBook(isbn);

    if (!book) {
      return;
    }

    // TODO: Actually calculate available copies
    return { ...book, availableCopies: book.copies };
  }
}
