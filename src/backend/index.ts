/**
 * Maison Harivé — Backend Services & Business Logic Layer
 */

import { products, type Product, type ProductCategory } from "@/content/products";

export interface ConciergeInquiry {
  name: string;
  phone?: string;
  email?: string;
  serviceType: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

export const BackendService = {
  /**
   * Search and filter products from the catalogue
   */
  getProducts(filter?: { category?: ProductCategory; featured?: boolean; query?: string }): Product[] {
    let result = products;
    if (filter?.category) {
      result = result.filter((p) => p.category === filter.category);
    }
    if (filter?.featured !== undefined) {
      result = result.filter((p) => Boolean(p.featured) === filter.featured);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return result;
  },

  /**
   * Get single product by id
   */
  getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
  },

  /**
   * Format royal reference ID
   */
  generateReferenceCode(): string {
    return `MH-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  },
};
