import type { BookRepository } from "@/data/BookRepository.ts";
import type { Book } from "@/domain/models/Book";

export class InMemoryBookRepository implements BookRepository {
  private bookMap: Record<Book["isbn"], Book> = {};

  public insert(book: Book): Book {
    const bookCopy = { ...book };

    this.bookMap[book.isbn] = bookCopy;

    return bookCopy;
  }

  public findByIsbn(isbn: string): Book | undefined {
    return this.bookMap[isbn];
  }

  public reset(): void {
    this.bookMap = {};
  }
}
