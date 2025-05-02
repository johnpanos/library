import type {
  CreateBookRequest,
  CreateBookResponse,
  GetBookDetailsResponse,
} from "@/dtos/BookDTOs.ts";
import type {
  CreateCustomerRequest,
  CreateCustomerResponse,
  GetCustomerDetailsResponse,
} from "@/dtos/CustomerDTOs.ts";
import type {
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  CreateReturnRequest,
  CreateReturnResponse,
  GetCustomerCheckedOutBooks,
} from "@/dtos/CheckoutDTOs.ts";

import { InMemoryBookRepository } from "@/data/in_memory/InMemoryBookRepository.ts";
import { BookService } from "@/domain/services/BookService.ts";

import { InMemoryCustomerRepository } from "@/data/in_memory/InMemoryCustomerRepository.ts";
import { CustomerService } from "@/domain/services/CustomerService.ts";

import { InMemoryCheckoutRepository } from "@/data/in_memory/InMemoryCheckoutRepository.ts";
import { CheckoutService } from "@/domain/services/CheckoutService.ts";
import type { Book } from "@/domain/models/Book.ts";

const bookRepository = new InMemoryBookRepository();
const customerRepository = new InMemoryCustomerRepository();
const checkoutRepository = new InMemoryCheckoutRepository();

const bookService = new BookService(bookRepository, checkoutRepository);
const customerService = new CustomerService(customerRepository);
const checkoutService = new CheckoutService(checkoutRepository);

const toDisplayDate = (date: Date) => date.toISOString().split("T")[0];

const server = Bun.serve({
  port: 3000,
  routes: {
    // MARK: Books
    "/api/books": {
      POST: async (req) => {
        const body = (await req.json()) as CreateBookRequest;

        const result = bookService.createBook(body);

        if (!result.ok) {
          return Response.json(
            { message: result.error.message },
            { status: 400 },
          );
        }

        const { title, author, isbn, copies } = result.value;
        const res: CreateBookResponse = {
          title,
          author,
          isbn,
          copies,
          available_copies: copies,
        };

        return Response.json(res, { status: 201 });
      },
    },
    "/api/books/:isbn": {
      GET: async (req) => {
        const book = bookService.getBookWithAvailableCopies(req.params.isbn);

        if (!book) {
          return Response.json({ message: "Not Found" }, { status: 404 });
        }

        const {
          isbn,
          author,
          copies,
          title,
          availableCopies: available_copies,
        } = book;

        const res: GetBookDetailsResponse = {
          isbn,
          title,
          author,
          available_copies,
          copies,
        };

        return Response.json(res);
      },
    },

    // MARK: Customers
    "/api/customers": {
      POST: async (req) => {
        const body = (await req.json()) as CreateCustomerRequest;

        const result = customerService.createCustomer({
          ...body,
          id: body.customer_id,
        });

        if (!result.ok) {
          return Response.json(
            { message: result.error.message },
            { status: 400 },
          );
        }

        const { id: customer_id, name, email } = result.value;

        const res: CreateCustomerResponse = {
          customer_id,
          name,
          email,
        };
        return Response.json(res, { status: 201 });
      },
    },
    "/api/customers/:customer_id": {
      GET: async (req) => {
        const customer = customerRepository.findById(req.params.customer_id);

        if (!customer) {
          return Response.json({ message: "Not Found" }, { status: 404 });
        }

        const { id: customer_id, name, email } = customer;

        const res: GetCustomerDetailsResponse = {
          customer_id,
          name,
          email,
        };
        return Response.json(res);
      },
    },
    "/api/customers/:customer_id/books": {
      GET: async (req) => {
        const customer = customerRepository.findById(req.params.customer_id);
        if (!customer) {
          return Response.json(
            { message: "Customer Not Found" },
            { status: 404 },
          );
        }

        const activeCheckouts = checkoutRepository
          .findByCustomer(customer)
          .filter(checkoutService.isCheckedOut);

        const books = activeCheckouts
          .map((co) => bookRepository.findByIsbn(co.isbn))
          .filter((book) => !!book)
          .reduce(
            (bookMap, book) => {
              bookMap[book?.isbn] = book;
              return bookMap;
            },
            {} as Record<Book["isbn"], Book>,
          );

        const res: GetCustomerCheckedOutBooks = activeCheckouts.map((ac) => {
          const book = books[ac.isbn]!;
          return {
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            due_date: toDisplayDate(ac.dueDate)!,
            checkout_date: toDisplayDate(ac.checkoutDate)!,
          };
        });
        return Response.json(res);
      },
    },

    // MARK: Checkouts/Returns
    "/api/checkouts": {
      POST: async (req) => {
        const body = (await req.json()) as CreateCheckoutRequest;

        const customer = customerRepository.findById(body?.customer_id || "");
        console.log(customer);
        if (!customer) {
          return Response.json(
            { message: "Customer Not Found" },
            { status: 404 },
          );
        }

        const book = bookRepository.findByIsbn(body?.isbn || "");
        if (!book) {
          return Response.json({ message: "Book Not Found" }, { status: 404 });
        }

        if (!body.due_date) {
          return Response.json(
            { message: "Due Date Missing" },
            { status: 400 },
          );
        }

        const result = checkoutService.checkoutBook(
          customer,
          book,
          new Date(body.due_date),
        );

        if (!result.ok) {
          return Response.json(
            { message: result.error.message },
            { status: 400 },
          );
        }

        const {
          id: checkout_id,
          customerId: customer_id,
          checkoutDate,
          dueDate,
          isbn,
        } = result.value;

        const res: CreateCheckoutResponse = {
          checkout_id,
          customer_id,
          title: book.title,
          isbn,
          checkout_date: toDisplayDate(checkoutDate)!,
          due_date: toDisplayDate(dueDate)!,
        };
        return Response.json(res, { status: 201 });
      },
    },
    "/api/returns": {
      POST: async (req) => {
        const body = (await req.json()) as CreateReturnRequest;

        const customer = customerRepository.findById(body?.customer_id || "");
        if (!customer) {
          return Response.json(
            { message: "Customer Not Found" },
            { status: 404 },
          );
        }

        const book = bookRepository.findByIsbn(body?.isbn || "");
        if (!book) {
          return Response.json({ message: "Book Not Found" }, { status: 404 });
        }

        const returnedCheckout = checkoutService.returnBook(customer, book)[0];

        if (!returnedCheckout) {
          return Response.json(
            { message: "Checkout Not Found" },
            { status: 404 },
          );
        }

        const res: CreateReturnResponse = {
          message: "Book returned successfully",
          isbn: book.isbn,
          customer_id: customer.id,
          return_date: toDisplayDate(returnedCheckout!.returnDate!)!,
        };
        return Response.json(res, { status: 201 });
      },
    },

    // MARK: Reset
    "/api/reset": {
      POST: async (req) => {
        bookRepository.reset();
        customerRepository.reset();
        checkoutRepository.reset();
        return Response.json({ message: "todo" });
      },
    },
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
