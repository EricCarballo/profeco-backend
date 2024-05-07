import { IsArray, IsNumber, IsString, MinLength } from "class-validator";

export class CreateProductoDto {

    @IsString()
    readonly nombre: string;

    @IsNumber()
    @MinLength(6)
    readonly codigoBarra: string;

    @IsNumber()
    readonly precio: number
    
    @IsNumber()
    readonly cantidad: number;

    @IsString()
    readonly img: string;

    @IsString()
    readonly descripcion: string;
    
    @IsString()
    readonly categoria: string;

}
