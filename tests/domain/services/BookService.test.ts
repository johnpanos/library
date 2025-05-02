import { expect, test } from "bun:test";
import { BookService } from "@/domain/services/BookService.ts";
import { createTestApplicationContext } from "../../TestEnvironment.ts";
import { ZodError } from "zod";

test("Create Book invalid", async () => {
  const { bookRepository: repository, checkoutRepository } =
    createTestApplicationContext();
  const service = new BookService(repository, checkoutRepository);

  const result = service.createBook({});

  expect(result.ok).toEqual(false);

  if (!result.ok) {
    const error = result.error as ZodError;

    expect(error.formErrors.fieldErrors).toContainAllKeys([
      "title",
      "author",
      "isbn",
      "copies",
    ]);
  }
});

test("Create Book valid (13 digit ISBN format)", async () => {
  const { bookRepository: repository, checkoutRepository } =
    createTestApplicationContext();
  const service = new BookService(repository, checkoutRepository);

  const expected = {
    title: "Discrete Math",
    author: "John Panos",
    isbn: "123456789ABCD",
    copies: 5,
  };
  const result = service.createBook(expected);

  expect(result.ok).toEqual(true);
});

test("Create Book valid (10 digit ISBN format)", async () => {
  const { bookRepository: repository, checkoutRepository } =
    createTestApplicationContext();
  const service = new BookService(repository, checkoutRepository);

  const expected = {
    title: "Discrete Math",
    author: "John Panos",
    isbn: "123456789A",
    copies: 5,
  };
  const result = service.createBook(expected);

  expect(result.ok).toEqual(true);
});

test("Create Book invalid ISBN length", async () => {
  const { bookRepository: repository, checkoutRepository } =
    createTestApplicationContext();
  const service = new BookService(repository, checkoutRepository);

  const expected = {
    title: "Discrete Math",
    author: "John Panos",
    isbn: "123",
    copies: 5,
  };
  const result = service.createBook(expected);

  if (!result.ok) {
    const error = result.error as ZodError;
    expect(error.formErrors.fieldErrors).toContainAllKeys(["isbn"]);
  }
});
