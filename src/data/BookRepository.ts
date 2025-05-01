import type { ResettableRepository } from "@/data/ResettableRepository.ts";
import type { Book } from "@/domain/models/Book.ts";

export interface BookRepository extends ResettableRepository {
  insert: (book: Book) => Book;
  findByIsbn: (isbn: string) => Book | undefined;
}
