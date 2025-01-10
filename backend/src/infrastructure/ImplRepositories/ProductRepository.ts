import { AppDataSource } from "../database/dataSources";
import { Product } from "../../domain/entities/Product";
import { IProductRepositories } from "../../domain/interfaces/IRepositories/IProductRepositories";
import { DeleteOrFindDTO } from "../../domain/dtos/product/DeleteOrFindDTO";
import { newProductDTO } from "../../domain/dtos/product/newProductDTO";
import { updateProductDTO } from "../../domain/dtos/product/updateProductDTO";


export class ProductRepository implements IProductRepositories {
    private productRepository = AppDataSource.getRepository(Product);

    async create(data: newProductDTO): Promise<Product> {
        if(!data.name)
            throw ('O nome é um campo obrigatório.');
        
        if(!data.price)
            throw ('O preço é um campo obrigatório.');
        data.stock = 0;
        let existsProduct = await this.findByName(data.name);

        if(existsProduct && existsProduct.length > 0){
            throw ('Já existe um produto com esse nome.');
        }
        return await this.productRepository.save(data);
    }
    
    async update(data: updateProductDTO): Promise<Product> {
        if(!data.id)
            throw ('O campo Id é obrigatório.');
        let existsProduct = await this.findOne(data.id);
        if(!existsProduct){
            throw ('Não existe esse produto.');
        }
        return await this.productRepository.save(data);
    }

    async findWithFilterProducts(data: DeleteOrFindDTO): Promise<Product[]> {
        let idValue;
        let nameValue;
        const queryBuilder = await this.productRepository.createQueryBuilder('Product');

        if(!!data.id && data.id != 0){
            idValue = String(data.id);
            queryBuilder.andWhere('Product.id LIKE :id', { id: `%${idValue}%` });
        }

        if(!!data.name && data.name != ''){
            nameValue = String(data.name);
            queryBuilder.andWhere('Product.name LIKE :name', { name: `%${nameValue}%` });
        }
        
        const products = await queryBuilder.getMany();
        return products;
    }

    async findOne(id: number): Promise<Product | null> {
        return await this.productRepository.findOneBy({ id });
    }

    async findByName(name: String): Promise<Product[] | null> {
        const queryBuilder = await this.productRepository.createQueryBuilder('Product');
        queryBuilder.andWhere('Product.name LIKE :name', { name: `%${name}%` });
        
        const products = await queryBuilder.getMany();
        return products;
    }

    async delete(id: number): Promise<void> {
        await this.productRepository.delete(id);
    }
}
