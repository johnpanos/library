import { expect, test } from "bun:test";

import { CustomerService } from "@/domain/services/CustomerService.ts";
import { createTestApplicationContext } from "../../TestEnvironment.ts";
import { ZodError } from "zod";

test("Create Customer invalid", async () => {
  const { customerRepository: repository } = createTestApplicationContext();
  const service = new CustomerService(repository);

  const result = service.createCustomer({});

  expect(result.ok).toEqual(false);

  if (!result.ok) {
    const error = result.error as ZodError;

    expect(error.formErrors.fieldErrors).toContainAllKeys([
      "id",
      "name",
      "email",
    ]);
  }
});

test("Create Customer invalid email", async () => {
  const { customerRepository: repository } = createTestApplicationContext();
  const service = new CustomerService(repository);

  const expected = {
    id: "CUST001",
    name: "John Panos",
    email: "email",
  };
  const result = service.createCustomer(expected);

  expect(result.ok).toEqual(false);

  if (!result.ok) {
    const error = result.error as ZodError;

    expect(error.formErrors.fieldErrors).toContainAllKeys(["email"]);
  }
});

test("Create Customer valid", async () => {
  const { customerRepository: repository } = createTestApplicationContext();
  const service = new CustomerService(repository);

  const expected = {
    id: "CUST001",
    name: "John Panos",
    email: "me@johnpanos.com",
  };
  const result = service.createCustomer(expected);

  expect(result.ok).toEqual(true);
});
