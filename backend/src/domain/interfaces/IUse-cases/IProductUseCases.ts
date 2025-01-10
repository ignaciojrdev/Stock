import { Product } from "../../entities/Product";
import { newProductDTO } from "../../dtos/product/newProductDTO";
import { DeleteOrFindDTO } from "../../dtos/product/DeleteOrFindDTO";
import { updateProductDTO } from "../../dtos/product/updateProductDTO";

export interface IProductUseCases{
    createProduct(data: newProductDTO): Promise<Product>;
    updateProduct(data: updateProductDTO): Promise<Product>;
    findWithFilterProducts(data: DeleteOrFindDTO): Promise<Product[]>;
    findOne(id: number): Promise<Product | null>;
    delete(id: number): Promise<void>;
}
