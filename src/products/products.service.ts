import { Injectable } from '@nestjs/common';
import { Product } from './product.schema';
import { TRPCError } from '@trpc/server';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  createProduct(productData: Product) {
    try {
      const exists = this.products.find(
        (p) => p.name.toLowerCase() === productData.name.toLowerCase(),
      );

      if (exists) {
        return {
          status: 409,
          message: `Product with name "${productData.name}" already exists ❌`,
          data: exists,
        };
      }

      this.products.push(productData);

      return {
        status: 201,
        message: 'Product created successfully ✅',
        data: productData,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error while creating product ❌',
        error: error.message,
      };
    }
  }

  getProductById(id: string): Product {
    if (typeof id !== 'string' || !id.trim()) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Product ID must be a valid non-empty string',
      });
    }

    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id "${id}" not found`,
      });
    }

    return product;
  }
}
