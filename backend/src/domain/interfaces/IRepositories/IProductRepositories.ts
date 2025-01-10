import { Product } from "../../entities/Product";
import { DeleteOrFindDTO } from "../../dtos/product/DeleteOrFindDTO";
import { updateProductDTO } from "../../dtos/product/updateProductDTO";
import { newProductDTO } from "../../dtos/product/newProductDTO";

export interface IProductRepositories {
    create(data: newProductDTO): Promise<Product>;
    update(data: updateProductDTO): Promise<Product>;
    findWithFilterProducts(data: DeleteOrFindDTO): Promise<Product[]>;
    findOne(id: number): Promise<Product | null>;
    findByName(name: String): Promise<Product[] | null>;
    delete(id: number): Promise<void>;
}
