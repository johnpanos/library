export type CreateCustomerRequest = {
  name?: string;
  email?: string;
  customer_id?: string;
};

export type CreateCustomerResponse = {
  name: string;
  email: string;
  customer_id: string;
};

export type GetCustomerDetailsResponse = {
  name: string;
  email: string;
  customer_id: string;
};
