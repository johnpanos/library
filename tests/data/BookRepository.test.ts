import { expect, test } from "bun:test";

import type { Book } from "@/domain/models/Book.ts";

import { createTestApplicationContext } from "../TestEnvironment.ts";

test("createBook", async () => {
  const { bookRepository: repository } = createTestApplicationContext();
  const expected: Book = {
    title: "Discrete Math",
    author: "John Panos",
    isbn: "2394823948932",
    copies: 3,
  };

  const actual = repository.insert(expected);

  expect(actual).toEqual(expected);
});

test("findByIsbn", async () => {
  const { bookRepository: repository } = createTestApplicationContext();
  const expected = {
    title: "Discrete Math",
    author: "John Panos",
    isbn: "2394823948932",
    copies: 3,
  };

  repository.insert(expected);

  const actual = repository.findByIsbn(expected.isbn);

  expect(actual).toEqual(expected);
});

test("reset", async () => {
  const { bookRepository: repository } = createTestApplicationContext();
  const expected = {
    title: "Discrete Math",
    author: "John Panos",
    isbn: "2394823948932",
    copies: 3,
  };

  repository.insert(expected);

  const actual = repository.findByIsbn(expected.isbn);

  expect(actual).toEqual(expected);

  repository.reset();

  expect(repository.findByIsbn(expected.isbn)).toBeUndefined();
});
