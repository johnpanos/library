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

const bookRepository = new InMemoryBookRepository();
const bookService = new BookService(bookRepository);

const customerRepository = new InMemoryCustomerRepository();
const customerService = new CustomerService(customerRepository);

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

        const result = customerService.createCustomer(body);

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
        return Response.json(res);
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
        const res: GetCustomerCheckedOutBooks = {};
        return Response.json(res);
      },
    },

    // MARK: Checkouts/Returns
    "/api/checkouts": {
      POST: async (req) => {
        const body = (await req.json()) as CreateCheckoutRequest;

        const res: CreateCheckoutResponse = {};
        return Response.json(res);
      },
    },
    "/api/returns": {
      POST: async (req) => {
        const body = (await req.json()) as CreateReturnRequest;

        const res: CreateReturnResponse = {};
        return Response.json(res);
      },
    },

    // MARK: Reset
    "/api/reset": {
      POST: async (req) => {
        return Response.json({ message: "todo" });
      },
    },
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
