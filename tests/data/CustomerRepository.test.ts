import { expect, test } from "bun:test";

import { createTestApplicationContext } from "../TestEnvironment.ts";
import type { Customer } from "@/domain/models/Customer.ts";

test("insert", async () => {
  const { customerRepository: repository } = createTestApplicationContext();
  const expected: Customer = {
    id: "CUST001",
    name: "John Panos",
    email: "me@johnpanos.com",
  };

  const actual = repository.insert(expected);

  expect(actual).toEqual(expected);
});

test("findById", async () => {
  const { customerRepository: repository } = createTestApplicationContext();
  const expected: Customer = {
    id: "CUST001",
    name: "John Panos",
    email: "me@johnpanos.com",
  };

  repository.insert(expected);

  const actual = repository.findById(expected.id);

  expect(actual).toEqual(expected);
});

test("reset", async () => {
  const { customerRepository: repository } = createTestApplicationContext();
  const expected: Customer = {
    id: "CUST001",
    name: "John Panos",
    email: "me@johnpanos.com",
  };

  repository.insert(expected);

  const actual = repository.findById(expected.id);

  expect(actual).toEqual(expected);

  repository.reset();

  expect(repository.findById(expected.id)).toBeUndefined();
});
