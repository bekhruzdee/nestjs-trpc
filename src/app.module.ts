import { Module } from '@nestjs/common';
import { TrpcModule } from './trpc/trpc.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [TrpcModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
