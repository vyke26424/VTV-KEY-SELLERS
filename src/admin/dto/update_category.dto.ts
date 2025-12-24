import { PartialType } from "@nestjs/swagger";
import { CreateCategory } from "./create_category.dto";

export class UpdateCategoryDto extends PartialType(CreateCategory){
    
}