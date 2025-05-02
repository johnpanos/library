import type { CheckoutRepository } from "@/data/CheckoutRepository.ts";
import type { Book } from "@/domain/models/Book";
import type { Checkout } from "@/domain/models/Checkout";
import type { Customer } from "@/domain/models/Customer";

export class InMemoryCheckoutRepository implements CheckoutRepository {
  private monotonicCheckoutId: number = 1;
  private checkoutMap: Record<string, Checkout> = {};

  insert(checkout: Omit<Checkout, "id">): Checkout {
    const checkoutCopy = {
      id: this.nextId(),
      ...checkout,
    };

    this.checkoutMap[checkoutCopy.id] = checkoutCopy;

    return checkoutCopy;
  }

  update(checkout: Checkout): Checkout {
    const checkoutCopy = { ...checkout };

    this.checkoutMap[checkoutCopy.id] = checkoutCopy;

    return checkoutCopy;
  }

  findById(id: Checkout["id"]): Checkout | undefined {
    return this.checkoutMap[id];
  }

  findByCustomer(customer: Customer): Checkout[] {
    return this.all().filter((co) => co.customerId === customer.id);
  }

  findByBook(book: Book): Checkout[] {
    return this.all().filter((co) => co.isbn === book.isbn);
  }

  findByBookAndCustomer(customer: Customer, book: Book): Checkout[] {
    return this.all().filter(
      (co) => co.isbn === book.isbn && co.customerId === customer.id,
    );
  }

  reset(): void {
    this.monotonicCheckoutId = 0;
    this.checkoutMap = {};
  }

  private all(): Checkout[] {
    return Object.values(this.checkoutMap);
  }

  private nextId() {
    const key = this.monotonicCheckoutId.toString().padStart(7, "0");
    this.monotonicCheckoutId += 1;

    return `CK${key}`;
  }
}
