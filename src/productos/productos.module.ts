import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Producto, ProductoSchema } from './entities/producto.entity';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Producto.name,
        schema: ProductoSchema
      }
    ])
  ]
})
export class ProductosModule {}
