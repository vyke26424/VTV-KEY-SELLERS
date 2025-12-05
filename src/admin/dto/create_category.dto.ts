import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateCategory {

    @IsString({message : 'Tên danh mục phải là chuỗi kí tự'})
    @IsNotEmpty({message : 'Tên danh mục không được để trống'})
    name : string ;

    @IsString()
    @IsOptional()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/ ,{
        message : 'slug chỉ được là chữ thường, số và dấu gạch ngang, ví dụ goi-vip-1'
    })
    slug? : string ;
}