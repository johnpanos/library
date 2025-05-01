const server = Bun.serve({
  port: 3000,
  routes: {
    // MARK: Books
    "/api/books": {
      POST: async (req) => {
        return Response.json({ message: "todo" });
      },
    },
    "/api/books/:isbn": {
      GET: async (req) => {
        return Response.json({ message: "todo" });
      },
    },

    // MARK: Customers
    "/api/customers": {
      POST: async (req) => {
        return Response.json({ message: "todo" });
      },
    },
    "/api/customers/:customer_id": {
      GET: async (req) => {
        return Response.json({ message: "todo" });
      },
    },
    "/api/customers/:customer_id/books": {
      GET: async (req) => {
        return Response.json({ message: "todo" });
      },
    },

    // MARK: Checkouts/Returns
    "/api/checkouts": {
      POST: async (req) => {
        return Response.json({ message: "todo" });
      },
    },
    "/api/returns": {
      POST: async (req) => {
        return Response.json({ message: "todo" });
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
