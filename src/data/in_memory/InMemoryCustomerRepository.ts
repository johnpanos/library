import type { CustomerRepository } from "@/data/CustomerRepository.ts";
import type { Customer } from "@/domain/models/Customer";

export class InMemoryCustomerRepository implements CustomerRepository {
  private customerMap: Record<string, Customer> = {};

  insert(customer: Customer): Customer {
    const customerCopy = { ...customer };

    this.customerMap[customerCopy.id] = customerCopy;

    return customerCopy;
  }

  findById(customerId: Customer["id"]): Customer | undefined {
    return this.customerMap[customerId];
  }

  reset(): void {
    this.customerMap = {};
  }
}
