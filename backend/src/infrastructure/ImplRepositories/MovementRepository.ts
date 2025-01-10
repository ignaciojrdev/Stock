import { AppDataSource } from "../database/dataSources";
import { Movement } from "../../domain/entities/Movement";
import { Product } from "../../domain/entities/Product";
import { IMovementRepositories } from "../../domain/interfaces/IRepositories/IMovementRepositories";
import { newMovementDTO } from "../../domain/dtos/movement/newMovementDTO";
import { filterMovementsDTO } from "../../domain/dtos/movement/filterMovementsDTO";


export class MovementRepository implements IMovementRepositories {
    private movementRepository = AppDataSource.getRepository(Movement);
    
    async create(data: newMovementDTO): Promise<Movement> {
        return await this.movementRepository.save(data);
    }

    async findWithFilterMovements(data: filterMovementsDTO): Promise<Movement[]> {
        let id;
        let product;
        let type;
        let command_id;

        const queryBuilder = await this.movementRepository.createQueryBuilder('Movement');
        queryBuilder.leftJoinAndSelect("Movement.product", "Product")
        if(!!data.id && data.id != 0){
            id = Number(data.id);
            queryBuilder.andWhere('Movement.id = :id', { id: id });
        }

        if(!!data.product && data.product != ''){
            product = String(data.product);
            queryBuilder.andWhere('Movement.product = :product', { product: product });
        }

        if(!!data.type && data.type != ''){
            type = String(data.type);
            queryBuilder.andWhere('Movement.type = :type', { type: type });
        }

        if(!!data.command && data.command != ''){
            command_id = Number(data.command);
            queryBuilder.andWhere('Movement.command = :command', { command: command_id });
        }
        
        const movement = await queryBuilder.getMany();
        return movement;
    }

    async findOne(id: number): Promise<Movement | null> {
        return await this.movementRepository.findOneBy({ id });
    }

    async delete(id: number): Promise<void> {
        await this.movementRepository.delete(id);
    }

    async getMovementsLikeIn(product: number): Promise<Movement>{
        const movements = await this.movementRepository.createQueryBuilder("Movement")
                                .select([
                                    'SUM(Movement.quantity) AS quantity'
                                ])
                                .where("Movement.product = :product", { product })
                                .andWhere('Movement.type = :type', { type: "IN"})
                                .getRawOne()
        return movements;
    }

    async getMovementsLikeOut(product: number): Promise<Movement>{
        const movements = await this.movementRepository.createQueryBuilder("Movement")
                                .select([
                                    'SUM(Movement.quantity) AS quantity'
                                  ])
                                .where("Movement.product = :product", { product })
                                .andWhere('Movement.type = :type', { type: "OUT"})
                                .getRawOne()
        return movements;
    }

    async getProductsByCommand(data: filterMovementsDTO): Promise<Movement[]> {
        let command_id: number;
        const queryBuilder = await this.movementRepository.createQueryBuilder('Movement');
    
        queryBuilder
            .leftJoinAndSelect("Movement.product", "Product")  // Faz o JOIN com a tabela de produtos
            .select("Product.name", 'name')  // Seleciona o nome do produto
            .addSelect("Product.id", "id")  // id do produto
            .addSelect("SUM(Movement.quantity)", "stock")  // Soma as quantidades de movimento
            .addSelect("Product.price", "price")  // Seleciona o preço do produto
    
            // Agrupando pelos campos de produto
            .groupBy("Product.name, Product.price, Product.id")  
    
        // Condicional para aplicar o filtro de "command"
        if (data.command && data.command !== '') {
            command_id = Number(data.command);
            queryBuilder.andWhere('Movement.command = :command', { command: command_id });
        }
    
        // Obtém os resultados brutos (raw)
        const movements = await queryBuilder.getRawMany();
        return movements;
    }
    
    async deleteAllProductsByCommand(commandId: number): Promise<void> {
        await this.movementRepository.delete({command: String(commandId)});
    }

    async deleteAllMovementationsBySpecificProduct(data: filterMovementsDTO): Promise<void> {
        await this.movementRepository.delete({command: String(data.command), product: String(data.product)});
    }

}
