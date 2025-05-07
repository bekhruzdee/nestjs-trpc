import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { ProductsService } from './products.service';
import { Product, productSchema } from './product.schema';
import { z } from 'zod';

@Router({ alias: 'products' })
export class ProductsRouter {
  constructor(private readonly productsService: ProductsService) {}

  @Query({
    input: z.object({ id: z.string() }),
    output: productSchema,
  })
  getProductById(@Input('id') id: string) {
    return this.productsService.getProductById(id);
  }
  @Query({
    output: z.array(productSchema),
  })
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      data: productSchema.partial(),
    }),
  })
  updateProduct(
    @Input('id') id: string,
    @Input('data') data: Partial<Product>,
  ) {
    return this.productsService.updateProduct(id, data);
  }

  @Mutation({
    input: productSchema,
    output: productSchema,
  })
  createProduct(@Input() productData: Product) {
    return this.productsService.createProduct(productData);
  }

  @Mutation({
    input: z.object({ id: z.string() }),
    output: z.boolean(),
  })
  deleteProduct(@Input('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
