import type { Customer } from "@/domain/models/Customer.ts";
import type { Result } from "@/types";
import type { Book } from "@/domain/models/Book.ts";
import type { CheckoutRepository } from "@/data/CheckoutRepository.ts";
import type { Checkout } from "@/domain/models/Checkout.ts";

const MAX_ACTIVE_CHECKOUTS_PER_CUSTOMER = 5;
export class CheckoutService {
  private checkoutRepository: CheckoutRepository;

  constructor(checkoutRepository: CheckoutRepository) {
    this.checkoutRepository = checkoutRepository;
  }

  public checkoutBook(
    customer: Customer,
    book: Book,
    dueDate: Date,
  ): Result<Checkout> {
    const existingCheckouts = this.checkoutRepository.findByBookAndCustomer(
      customer,
      book,
    );

    const activeCheckoutForBook = existingCheckouts.filter((c) =>
      this.isCheckedOut(c),
    );

    if (activeCheckoutForBook.length > 0) {
      return {
        ok: false,
        error: new Error(`Customer has already checked out ${book.title}`),
      };
    }

    const allActiveCheckoutsForCustomer = this.checkoutRepository
      .findByCustomer(customer)
      .filter((c) => this.isCheckedOut(c));

    if (
      allActiveCheckoutsForCustomer.length >= MAX_ACTIVE_CHECKOUTS_PER_CUSTOMER
    ) {
      return {
        ok: false,
        error: new Error(
          `Customers may not have more than ${MAX_ACTIVE_CHECKOUTS_PER_CUSTOMER} active checkouts at a time`,
        ),
      };
    }

    const activeCheckoutsForBook = this.checkoutRepository
      .findByBook(book)
      .filter((c) => this.isCheckedOut(c)).length;

    if (activeCheckoutsForBook >= book.copies) {
      return {
        ok: false,
        error: new Error("There are no available copies to checkout"),
      };
    }

    const checkout = this.checkoutRepository.insert({
      isbn: book.isbn,
      customerId: customer.id,
      checkoutDate: new Date(),
      dueDate,
    });

    return {
      ok: true,
      value: checkout,
    };
  }

  public returnBook(customer: Customer, book: Book): Result<Checkout> {
    const checkouts = this.checkoutRepository
      .findByBookAndCustomer(customer, book)
      .filter((c) => this.isCheckedOut(c));

    const updatedCheckouts = checkouts.map((checkout) => {
      checkout.returnDate = new Date();
      return this.checkoutRepository.update(checkout);
    });

    const updatedCheckout = updatedCheckouts[0];

    if (!updatedCheckout) {
      return { ok: false, error: new Error("Could not return book") };
    }

    return { ok: true, value: updatedCheckout };
  }

  public isCheckedOut(checkout: Checkout): boolean {
    return !checkout.returnDate;
  }
}
