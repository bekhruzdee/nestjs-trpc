import { Injectable } from '@nestjs/common';
import { Product } from './product.schema';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  createProduct(productData: Product) {
    this.products.push(productData);
    return productData;
  }
}
