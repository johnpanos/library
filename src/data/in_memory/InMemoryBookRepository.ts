import type { BookRepository } from "@/data/BookRepository.ts";
import type { Book } from "@/domain/models/Book";

export class InMemoryBookRepository implements BookRepository {
  public insert(book: Book): Book {
    throw new Error("Method not implemented.");
  }

  public findByIsbn(isbn: string): Book | undefined {
    throw new Error("Method not implemented.");
  }

  public reset(): void {
    throw new Error("Method not implemented.");
  }
}
