type CreateBookRequest = {
  title?: string;
  author?: string;
  isbn?: string;
  copies?: number;
};

type CreateBookResponse = {
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available_copies: number;
};

type GetBookDetailsResponse = {
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available_copies: number;
};

type CreateCustomerRequest = {
  name?: string;
  email?: string;
  customer_id?: string;
};

type CreateCustomerResponse = {
  name: string;
  email: string;
  customer_id: string;
};

type GetCustomerDetailsResponse = {
  name: string;
  email: string;
  customer_id: string;
};

type CreateCheckoutRequest = {
  isbn?: string;
  customer_id?: string;
  due_date?: string;
};

type CreateCheckoutResponse = {
  checkout_id: string;
  isbn: string;
  title: string;
  customer_id: string;
  checkout_date: string;
  due_date: string;
};

type CreateReturnRequest = {
  isbn?: string;
  customer_id?: string;
};

type CreateReturnResponse = {
  message: string;
  isbn: string;
  customer_id: string;
  return_date: string;
};

type GetCustomerCheckedOutBooks = {
  isbn: string;
  title: string;
  author: string;
  checkout_date: string;
  due_date: string;
};

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
