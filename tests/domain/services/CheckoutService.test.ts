import { expect, test } from "bun:test";

import { CustomerService } from "@/domain/services/CustomerService.ts";
import { createTestApplicationContext } from "../../TestEnvironment.ts";
import { BookService } from "@/domain/services/BookService.ts";
import { CheckoutService } from "@/domain/services/CheckoutService.ts";

test("Checkout book", async () => {
  const { customerRepository, checkoutRepository, bookRepository } =
    createTestApplicationContext();
  const customerService = new CustomerService(customerRepository);

  const panosResult = customerService.createCustomer({
    id: "CUST001",
    name: "John Panos",
    email: "me@johnpanos.com",
  });

  if (!panosResult.ok) {
    throw new Error("Failed to create customers");
  }

  const panos = panosResult.value;
  const bookService = new BookService(bookRepository, checkoutRepository);

  const bookResult = bookService.createBook({
    title: "Discrete Math",
    author: "J. Hunter",
    isbn: "123456789A",
    copies: 1,
  });

  if (!bookResult.ok) {
    throw new Error("Book doesn't exist");
  }

  expect(bookResult.ok).toBe(true);
  const book = bookResult.value;

  const checkoutService = new CheckoutService(checkoutRepository);

  let activeCount = checkoutRepository
    .findByCustomer(panos)
    .filter(checkoutService.isCheckedOut).length;
  expect(activeCount).toBe(0);

  const checkout = checkoutService.checkoutBook(panos, book, new Date());
  activeCount = checkoutRepository
    .findByCustomer(panos)
    .filter(checkoutService.isCheckedOut).length;

  expect(checkout.ok).toBe(true);
  expect(activeCount).toBe(1);
});

test("Prevents checkout when customer has attempts to checkout > 5 books at a time", async () => {
  const { customerRepository, checkoutRepository, bookRepository } =
    createTestApplicationContext();

  const customerService = new CustomerService(customerRepository);

  const panosResult = customerService.createCustomer({
    id: "CUST001",
    name: "John Panos",
    email: "me@johnpanos.com",
  });

  if (!panosResult.ok) {
    throw new Error("Failed to create customer");
  }

  const panos = panosResult.value;

  const bookService = new BookService(bookRepository, checkoutRepository);

  const books = [1, 2, 3, 4, 5, 6, 7]
    .map((num) =>
      bookService.createBook({
        title: `Discrete Math Edition ${num}`,
        author: `J. Hunter ${num}`,
        isbn: `${num}23456789A`,
        copies: 1,
      }),
    )
    .filter((result) => result.ok)
    .map((result) => result.value);

  expect(books.length).toBe(7);

  const checkoutService = new CheckoutService(checkoutRepository);

  books.forEach((book, index) => {
    const result = checkoutService.checkoutBook(panos, book, new Date());
    expect(result.ok).toBe(index < 5);
  });

  const panosActiveCheckouts = checkoutRepository
    .findByCustomer(panos)
    .filter((c) => checkoutService.isCheckedOut(c)).length;
  expect(panosActiveCheckouts).toBe(5);
});

test("Prevents checkout when book is already checked out", async () => {
  const { customerRepository, checkoutRepository, bookRepository } =
    createTestApplicationContext();
  const customerService = new CustomerService(customerRepository);

  const panosResult = customerService.createCustomer({
    id: "CUST001",
    name: "John Panos",
    email: "me@johnpanos.com",
  });
  const doeResult = customerService.createCustomer({
    id: "CUST002",
    name: "John Doe",
    email: "me@johndoe.com",
  });

  if (!panosResult.ok || !doeResult.ok) {
    throw new Error("Failed to create customers");
  }

  const panos = panosResult.value;
  const doe = doeResult.value;

  const bookService = new BookService(bookRepository, checkoutRepository);

  const bookResult = bookService.createBook({
    title: "Discrete Math",
    author: "J. Hunter",
    isbn: "123456789A",
    copies: 1,
  });

  if (!bookResult.ok) {
    throw new Error("Book doesn't exist");
  }

  expect(bookResult.ok).toBe(true);
  const book = bookResult.value;

  const checkoutService = new CheckoutService(checkoutRepository);

  let activeCount = checkoutRepository
    .findByBook(book)
    .filter((c) => checkoutService.isCheckedOut(c)).length;
  expect(activeCount).toBe(0);

  const checkout = checkoutService.checkoutBook(panos, book, new Date());
  expect(checkout.ok).toBe(true);

  activeCount = checkoutRepository
    .findByBook(book)
    .filter((c) => checkoutService.isCheckedOut(c)).length;
  expect(activeCount).toBe(1);

  const doeCheckout = checkoutService.checkoutBook(doe, book, new Date());
  expect(doeCheckout.ok).toBe(false);
});

test("Return book", async () => {
  const { customerRepository, checkoutRepository, bookRepository } =
    createTestApplicationContext();
  const customerService = new CustomerService(customerRepository);

  const panosResult = customerService.createCustomer({
    id: "CUST001",
    name: "John Panos",
    email: "me@johnpanos.com",
  });

  if (!panosResult.ok) {
    throw new Error("Failed to create customers");
  }

  const panos = panosResult.value;
  const bookService = new BookService(bookRepository, checkoutRepository);

  const bookResult = bookService.createBook({
    title: "Discrete Math",
    author: "J. Hunter",
    isbn: "123456789A",
    copies: 1,
  });

  if (!bookResult.ok) {
    throw new Error("Book doesn't exist");
  }

  expect(bookResult.ok).toBe(true);
  const book = bookResult.value;

  const checkoutService = new CheckoutService(checkoutRepository);

  let activeCount = checkoutRepository
    .findByCustomer(panos)
    .filter(checkoutService.isCheckedOut).length;
  expect(activeCount).toBe(0);

  const checkout = checkoutService.checkoutBook(panos, book, new Date());
  activeCount = checkoutRepository
    .findByCustomer(panos)
    .filter(checkoutService.isCheckedOut).length;

  expect(checkout.ok).toBe(true);
  expect(activeCount).toBe(1);

  const returned = checkoutService.returnBook(panos, book);
  activeCount = checkoutRepository
    .findByCustomer(panos)
    .filter(checkoutService.isCheckedOut).length;
  expect(activeCount).toBe(0);
});
