import type { CustomerRepository } from "@/data/CustomerRepository.ts";

export class InMemoryCustomerRepository implements CustomerRepository {
  reset(): void {
    throw new Error("Method not implemented.");
  }
}
