import type { ResettableRepository } from "@/data/ResettableRepository.ts";
import type { Checkout } from "@/domain/models/Checkout.ts";
import type { Customer } from "@/domain/models/Customer.ts";
import type { Book } from "@/domain/models/Book.ts";

export interface CheckoutRepository extends ResettableRepository {
  insert(checkout: Omit<Checkout, "id">): Checkout;
  update(checkout: Checkout): Checkout;

  findById(id: Checkout["id"]): Checkout | undefined;
  findByCustomer(customer: Customer): Checkout[];
  findByBook(book: Book): Checkout[];
  findByBookAndCustomer(customer: Customer, book: Book): Checkout[];
}
