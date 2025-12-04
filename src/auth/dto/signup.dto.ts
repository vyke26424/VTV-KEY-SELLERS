import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email : string;
    @IsString()
    @IsNotEmpty()
    password : string;
    @IsOptional()
    @IsString()
    fullName? :string
}