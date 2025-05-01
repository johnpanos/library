import type { CheckoutRepository } from "@/data/CheckoutRepository.ts";

export class InMemoryCheckoutRepository implements CheckoutRepository {
  reset(): void {
    throw new Error("Method not implemented.");
  }
}
