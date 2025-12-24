import { PartialType } from "@nestjs/swagger";
import { CreateProduct } from "./create-product.dto";

export class UpdateProduct extends PartialType(CreateProduct) {
    
}