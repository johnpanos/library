export type CreateCheckoutRequest = {
  isbn?: string;
  customer_id?: string;
  due_date?: string;
};

export type CreateCheckoutResponse = {
  checkout_id: string;
  isbn: string;
  title: string;
  customer_id: string;
  checkout_date: string;
  due_date: string;
};

export type CreateReturnRequest = {
  isbn?: string;
  customer_id?: string;
};

export type CreateReturnResponse = {
  message: string;
  isbn: string;
  customer_id: string;
  return_date: string;
};

export type GetCustomerCheckedOutBooks = {
  isbn: string;
  title: string;
  author: string;
  checkout_date: string;
  due_date: string;
};
