export type Book = {
  title: string;
  author: string;
  isbn: string;
  copies: number;
};

export type BookWithAvailableCopies = Book & {
  availableCopies: number;
};
