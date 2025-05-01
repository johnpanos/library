export type CreateBookRequest = {
  title?: string;
  author?: string;
  isbn?: string;
  copies?: number;
};

export type CreateBookResponse = {
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available_copies: number;
};

export type GetBookDetailsResponse = {
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available_copies: number;
};
