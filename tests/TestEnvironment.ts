import type { ApplicationContext } from "@/ApplicationContext.ts";
import { InMemoryBookRepository } from "@/data/in_memory/InMemoryBookRepository.ts";
import { InMemoryCustomerRepository } from "@/data/in_memory/InMemoryCustomerRepository.ts";
import { InMemoryCheckoutRepository } from "@/data/in_memory/InMemoryCheckoutRepository.ts";

export function createTestApplicationContext(): ApplicationContext {
  return {
    bookRepository: new InMemoryBookRepository(),
    customerRepository: new InMemoryCustomerRepository(),
    checkoutRepository: new InMemoryCheckoutRepository(),
  };
}
