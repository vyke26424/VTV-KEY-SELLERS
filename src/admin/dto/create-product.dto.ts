import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
    ValidateNested
} from "class-validator";

// --- Helper: Hàm giúp parse JSON an toàn ---
const parseJson = ({ value }: any) => {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch (error) {
            return value; // Trả về nguyên gốc để Validator báo lỗi sau
        }
    }
    return value;
}

export class CreateProductVariant {
    @IsString()
    @IsNotEmpty({ message: 'Tên biến thể không được để rỗng' })
    name: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number) // Ép kiểu số
    price: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    orginalPrice: number;
}

export class CreateProduct {
    @IsString()
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
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
    @Transform(({ value }) => value === 'true' || value === true)
    isHot?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @IsOptional()
    @IsArray()
    @Transform(parseJson)
    @IsString({ each: true })
    keywords?: string[];

    @IsObject()
    @IsOptional()
    @Transform(parseJson)
    aiMetadata?: Record<string, any>;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    orginalPrice?: number;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    categoryId: number;

    @IsOptional()
    @IsArray()
    @Transform(parseJson)
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariant)
    variants?: CreateProductVariant[];
}