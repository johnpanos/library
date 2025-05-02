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
