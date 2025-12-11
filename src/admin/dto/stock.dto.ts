import { ApiProperty } from "@nestjs/swagger";
import { StockStatus } from "@prisma/client";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateStockDto {
    @IsInt()
    @IsNotEmpty()
    variantId : number ;
    
    @ApiProperty({example : ['VCB', 'ACB']})
    @IsArray()
    @IsString({each : true})
    credentials : string[];
    @ApiProperty({example : {expireDate : '31-12-2025'}})
    @IsOptional()
    metadata? : any ;
}

export class UpdateStockDto {
    @IsString()
    @IsOptional()
    credential? : string ;
    @IsEnum(StockStatus)
    @IsOptional()
    status? : StockStatus;
    @IsOptional()
    metadata? : any;
}

export class FilterStockDto {
    @IsOptional()
    variantId? : number ;
    @IsEnum(StockStatus)
    @IsOptional()
    status? :  StockStatus ;
}