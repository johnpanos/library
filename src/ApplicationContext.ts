import type { BookRepository } from "@/data/BookRepository.ts";
import type { CustomerRepository } from "@/data/CustomerRepository.ts";
import type { CheckoutRepository } from "@/data/CheckoutRepository.ts";

export type ApplicationContext = {
  bookRepository: BookRepository;
  customerRepository: CustomerRepository;
  checkoutRepository: CheckoutRepository;
};
