import { Input, Mutation, Router } from 'nestjs-trpc';
import { ProductsService } from './products.service';
import { Product, productSchema } from './product.schema';

@Router({ alias: 'products' })
export class ProductsRouter {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation({
    input: productSchema,
    output: productSchema,
  })
  createProduct(@Input() productData: Product) {
    return this.productsService.createProduct(productData);
  }
}
