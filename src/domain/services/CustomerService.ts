import { z, ZodError } from "zod";
import type { Customer } from "@/domain/models/Customer.ts";
import type { CustomerRepository } from "@/data/CustomerRepository.ts";
import type { Result } from "@/types";

const CreateCustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email("Must be a valid email"),
});

type CreateCustomerArgs = {
  id?: string;
  name?: string;
  email?: string;
};
export class CustomerService {
  private customerRepository: CustomerRepository;

  constructor(customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  public createCustomer(
    customerArgs: CreateCustomerArgs,
  ): Result<Customer, ZodError | Error> {
    const { data, error, success } =
      CreateCustomerSchema.safeParse(customerArgs);

    if (!success) {
      return { ok: false, error };
    }

    const existingCustomer = this.customerRepository.findById(data.id);

    if (existingCustomer) {
      return {
        ok: false,
        error: new Error(`Customer with the ID ${data.id} already exists`),
      };
    }

    const customer = this.customerRepository.insert(data);

    return {
      ok: true,
      value: customer,
    };
  }
}
