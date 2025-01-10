import { IProductUseCases } from "../../domain/interfaces/IUse-cases/IProductUseCases";
import { IMovementUseCases } from "../../domain/interfaces/IUse-cases/IMovementUseCases";
import { IProductRepositories } from "../../domain/interfaces/IRepositories/IProductRepositories";
import { newProductDTO } from "../../domain/dtos/product/newProductDTO";
import { DeleteOrFindDTO } from "../../domain/dtos/product/DeleteOrFindDTO";
import { updateProductDTO } from "../../domain/dtos/product/updateProductDTO";
import { filterMovementsDTO } from "../../domain/dtos/movement/filterMovementsDTO";
import { Product } from "../../domain/entities/Product";

export class ProductUseCases implements IProductUseCases{
    constructor(
        private productRepositories: IProductRepositories,
        private movementUseCases: IMovementUseCases,
    ) {}

    async createProduct(data: newProductDTO): Promise<Product> {
        return await this.productRepositories.create(data);
    }

    async updateProduct(data: updateProductDTO): Promise<Product> {
        return await this.productRepositories.update(data);
    }

    async findWithFilterProducts(data: DeleteOrFindDTO): Promise<Product[]>{
        const products = await this.productRepositories.findWithFilterProducts(data);
        //let productsWithStock = await this.movementUseCases.getStockByProduct(products);
        return products;
    }

    async findOne(id: number): Promise<Product | null>{
        return await this.productRepositories.findOne(id);
    }

    async delete(id: number): Promise<void>{
        //validar se não existe movimentações para o produto
        let filterMovements: filterMovementsDTO = {product: String(id)};
        let existsSomeMovement = await this.movementUseCases.findWithFilterMovements(filterMovements);
        if(existsSomeMovement){
            throw("Operação bloqueada. Não é permitido excluir o produto pois existem movimentações relacionadas a esse produto.")
        }
        this.productRepositories.delete(id);
    }
}