import type { CustomerRepository } from "@/data/CustomerRepository.ts";
import type { Customer } from "@/domain/models/Customer";

export class InMemoryCustomerRepository implements CustomerRepository {
  insert(customer: Customer): Customer {
    throw new Error("Method not implemented.");
  }

  findById(customerId: Customer["id"]): Customer {
    throw new Error("Method not implemented.");
  }

  reset(): void {
    throw new Error("Method not implemented.");
  }
}
