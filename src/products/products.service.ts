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
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Product with name "${productData.name}" already exists ❌`,
        });
      }

      this.products.push(productData);

      return {
        code: 'CREATED',
        message: 'Product created successfully ✅',
        data: productData,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error while creating product ❌',
        cause: error,
      });
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

  
  getAllProducts() {
    try {
      return {
        code: 'OK',
        message: 'All products retrieved successfully ✅',
        data: this.products,
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve products ❌',
        cause: error,
      });
    }
  }

  updateProduct(id: string, data: Partial<Product>) {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id "${id}" not found ❌`,
      });
    }

    const updatedProduct = {
      ...this.products[productIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.products[productIndex] = updatedProduct;

    return {
      code: 'OK',
      message: `Product with id "${id}" updated successfully ✅`,
      data: updatedProduct,
    };
  }

  deleteProduct(id: string) {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id "${id}" not found ❌`,
      });
    }

    const deletedProduct = this.products[productIndex];
    this.products.splice(productIndex, 1);

    return {
      code: 'OK',
      message: `Product with id "${id}" deleted successfully ✅`,
      data: deletedProduct,
    };
  }
}
