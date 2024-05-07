import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Producto {

    _id?: string;

    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true, unique: true })
    codigoBarra: string;

    @Prop({ required: true })
    precio: number
    
    @Prop({ required: true })
    cantidad: number;

    @Prop({ required: true })
    img: string;

    @Prop({ required: true })
    descripcion: string;
    
    @Prop({ required: true })
    categoria: string;

}

export const ProductoSchema = SchemaFactory.createForClass( Producto );
