import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { promisify } from 'util';
import * as fs from 'fs-extra';

import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {

  
  constructor(
    @InjectModel( Producto.name ) private readonly productoModel: Model<Producto>
  ) {}
  
  async create(createProductoDto: CreateProductoDto) {
    const readFileAsync = promisify(fs.readFile);

    try {
      // Lee la imagen como un buffer
      const imgBuffer = await readFileAsync(createProductoDto.img);

      // Convierte el buffer de la imagen a base64
      const imgBase64 = imgBuffer.toString('base64');

      const newProducto = await this.productoModel.create({
        ...createProductoDto,
        img: imgBase64, // Almacena la imagen como base64 en lugar de la ruta del archivo
      });

      return {
        Producto: createProductoDto
      };
    } catch (error) {
      console.log(error);
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.productoModel.find();
  }

  findAllDB() {
    return this.productoModel.find().select('-img');
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }

  private handleExceptions( error: any ) {
    if( error.code === 11000) {
      throw new BadRequestException(`Producto Existente en db ${ JSON.stringify( error.keyValue ) }` );
    }
    throw new InternalServerErrorException('No se pudo crear el nuevo Producto - Checar la consola de comandos')     
  }

}
