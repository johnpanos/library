import type { Book } from "../models/Book.ts";
import type { Result } from "../../types.ts";

type CreateBookArgs = {
  title?: string;
  author?: string;
  isbn?: string;
  copies?: number;
};
export class BookService {
  public createBook(bookArgs: CreateBookArgs): Result<Book> {
    return { ok: false, error: new Error("Not Implemented") };
  }
}
