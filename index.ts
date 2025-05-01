import type {
  CreateBookRequest,
  CreateBookResponse,
  GetBookDetailsResponse,
} from "./src/dtos/BookDTOs.ts";
import type {
  CreateCustomerRequest,
  CreateCustomerResponse,
  GetCustomerDetailsResponse,
} from "./src/dtos/CustomerDTOs.ts";
import type {
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  CreateReturnRequest,
  CreateReturnResponse,
  GetCustomerCheckedOutBooks,
} from "./src/dtos/CheckoutDTOs.ts";

const server = Bun.serve({
  port: 3000,
  routes: {
    // MARK: Books
    "/api/books": {
      POST: async (req) => {
        const body = (await req.json()) as CreateBookRequest;

        const res: CreateBookResponse = {};
        return Response.json(res);
      },
    },
    "/api/books/:isbn": {
      GET: async (req) => {
        const res: GetBookDetailsResponse = {};
        return Response.json(res);
      },
    },

    // MARK: Customers
    "/api/customers": {
      POST: async (req) => {
        const body = (await req.json()) as CreateCustomerRequest;

        const res: CreateCustomerResponse = {};
        return Response.json(res);
      },
    },
    "/api/customers/:customer_id": {
      GET: async (req) => {
        const res: GetCustomerDetailsResponse = {};
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
