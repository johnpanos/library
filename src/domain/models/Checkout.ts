import type { Book } from "./Book.ts";
import type { Customer } from "./Customer.ts";

export type Checkout = {
  id: string;
  isbn: Book["isbn"];
  customerId: Customer["id"];
  checkoutDate: Date;
  dueDate: Date;
  returnDate?: Date;
};
