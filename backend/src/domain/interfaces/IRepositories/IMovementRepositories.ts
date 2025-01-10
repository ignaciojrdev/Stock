import { Movement } from "../../entities/Movement";
import { newMovementDTO } from "../../dtos/movement/newMovementDTO";
import { filterMovementsDTO } from "../../dtos/movement/filterMovementsDTO";
import { Product } from "../../../domain/entities/Product";
export interface IMovementRepositories {
    create(data: newMovementDTO): Promise<Movement>;
    findWithFilterMovements(data: filterMovementsDTO): Promise<Movement[]>;
    findOne(id: number): Promise<Movement | null>;
    delete(id: number): Promise<void>;
    deleteAllProductsByCommand(idCommand: number): Promise<void>;
    deleteAllMovementationsBySpecificProduct(data: filterMovementsDTO): Promise<void>;
    getMovementsLikeIn(product: number): Promise<Movement>;
    getMovementsLikeOut(product: number): Promise<Movement>;
    getProductsByCommand(data: filterMovementsDTO): Promise<Movement[]>;
    ///getStockByProducts(products: Product[]): Promise<Movement[]>;
}
