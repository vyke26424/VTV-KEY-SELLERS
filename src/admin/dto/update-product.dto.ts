import { PartialType } from "@nestjs/swagger";
import { CreateProuct } from "./create-product.dto";

export class UpdateProduct extends PartialType(CreateProuct) {
    
}