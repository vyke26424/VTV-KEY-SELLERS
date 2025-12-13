import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean, // <--- THÊM CÁI NÀY
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
    ValidateNested
} from "class-validator";

export class CreateProductVariant {
    @IsString()
    @IsNotEmpty({ message: 'Tên không được để rỗng' })
    name: string;

    @IsNumber()
    @Min(0, { message: 'Giá không được là số âm' })
    price: number;

    @IsNumber()
    @Min(0, { message: 'Giá không được là số âm' })
    orginalPrice: number;
}

export class CreateProuct {
    @IsString()
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    thumbnail?: string;

    @IsOptional()
    @IsBoolean()
    isHot?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    keywords?: string[];

    @IsObject()
    @IsOptional()
    meta?: Record<string, any>; 
    
    @IsNumber()
    @IsNotEmpty()
    categoryId: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariant)
    variants?: CreateProductVariant[];
}