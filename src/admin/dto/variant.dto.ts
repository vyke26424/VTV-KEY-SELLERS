import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateVariantDto {
    @IsString()
    @IsNotEmpty({message : 'Tên gói không được để trống'})
    name : string ;
    @Type(() => Number)
    @IsNumber({}, {message : 'Giá bán phải là số'})
    @Min(0, {message : 'Giá bán không được âm'})
    price : string ;

    @Type(() => Number)
    @IsNumber({}, {message : ' Giá gốc phải là số'})
    @Min(0, {message : "Giá gốc không được âm"})
    orginalPrice : number
}

export class UpdateVariantDto extends PartialType(CreateVariantDto) {
    
}