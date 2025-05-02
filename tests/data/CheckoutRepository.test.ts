import { expect, test } from "bun:test";

import type { Checkout } from "@/domain/models/Checkout.ts";

import { createTestApplicationContext } from "../TestEnvironment.ts";
import type { Customer } from "@/domain/models/Customer.ts";
import type { Book } from "@/domain/models/Book.ts";

test("insert", async () => {
  const { checkoutRepository: repository } = createTestApplicationContext();
  const expected: Omit<Checkout, "id"> = {
    isbn: "123",
    customerId: "CUST001",
    checkoutDate: new Date(),
    dueDate: new Date(),
  };

  const actual = repository.insert(expected);

  expect({ ...expected, id: actual.id }).toEqual(actual);
});

test("update", async () => {
  const { checkoutRepository: repository } = createTestApplicationContext();
  const expected: Omit<Checkout, "id"> = {
    isbn: "123",
    customerId: "CUST001",
    checkoutDate: new Date(),
    dueDate: new Date(),
  };

  const oldCheckout = repository.insert(expected);
  repository.update({
    ...oldCheckout,
    customerId: "CUST002",
  });

  const newCheckout = repository.findById(oldCheckout.id);

  expect(oldCheckout.customerId).toEqual("CUST001");
  expect(newCheckout?.customerId).toEqual("CUST002");
});

test("findById", async () => {
  const { checkoutRepository: repository } = createTestApplicationContext();
  const expected: Omit<Checkout, "id"> = {
    isbn: "123",
    customerId: "CUST001",
    checkoutDate: new Date(),
    dueDate: new Date(),
  };

  const { id } = repository.insert(expected);
  const actual = repository.findById(id);

  expect(actual).toBeDefined();
  if (actual) {
    expect({ ...expected, id: actual?.id }).toEqual(actual);
  }
});

test("findByCustomer", async () => {
  const { checkoutRepository: repository } = createTestApplicationContext();
  const expected: Omit<Checkout, "id"> = {
    isbn: "123",
    customerId: "CUST001",
    checkoutDate: new Date(),
    dueDate: new Date(),
  };

  repository.insert(expected);
  const actual = repository.findByCustomer({ id: "CUST001" } as Customer);

  expect(actual).toBeDefined();
  expect(actual.length).toEqual(1);
});

test("findByBook", async () => {
  const { checkoutRepository: repository } = createTestApplicationContext();
  const expected: Omit<Checkout, "id"> = {
    isbn: "123",
    customerId: "CUST001",
    checkoutDate: new Date(),
    dueDate: new Date(),
  };

  repository.insert(expected);
  const actual = repository.findByBook({ isbn: "123" } as Book);

  expect(actual).toBeDefined();
  expect(actual.length).toEqual(1);
});

test("findByBookAndCustomer", async () => {
  const { checkoutRepository: repository } = createTestApplicationContext();
  const expected: Omit<Checkout, "id"> = {
    isbn: "123",
    customerId: "CUST001",
    checkoutDate: new Date(),
    dueDate: new Date(),
  };

  repository.insert(expected);
  const actual = repository.findByBookAndCustomer(
    { id: "CUST001" } as Customer,
    { isbn: "123" } as Book,
  );

  expect(actual).toBeDefined();
  expect(actual.length).toEqual(1);
});
