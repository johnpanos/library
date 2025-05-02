import type { CheckoutRepository } from "@/data/CheckoutRepository.ts";
import type { Book } from "@/domain/models/Book";
import type { Checkout } from "@/domain/models/Checkout";
import type { Customer } from "@/domain/models/Customer";

export class InMemoryCheckoutRepository implements CheckoutRepository {
  insert(checkout: Checkout): Checkout {
    throw new Error("Method not implemented.");
  }

  return(checkout: Checkout, returnDate: Date): Checkout {
    throw new Error("Method not implemented.");
  }

  findById(id: Checkout["id"]): Checkout | undefined {
    throw new Error("Method not implemented.");
  }

  findByCustomer(customer: Customer): Checkout[] {
    throw new Error("Method not implemented.");
  }

  findByBook(book: Book): Checkout[] {
    throw new Error("Method not implemented.");
  }

  findCheckoutByBookAndCustomer(customer: Customer, book: Book): Checkout[] {
    throw new Error("Method not implemented.");
  }

  reset(): void {
    throw new Error("Method not implemented.");
  }
}
