import type { ResettableRepository } from "@/data/ResettableRepository.ts";
import type { Customer } from "@/domain/models/Customer.ts";

export interface CustomerRepository extends ResettableRepository {
  insert(customer: Customer): Customer;
  findById(customerId: Customer["id"]): Customer | undefined;
}
