import { Movement } from "../../entities/Movement";
import { newMovementDTO } from "../../dtos/movement/newMovementDTO";
import { filterMovementsDTO } from "../../dtos/movement/filterMovementsDTO";
import { Product } from "../../entities/Product";
import { newProductDTO } from "../../../domain/dtos/product/newProductDTO";

export interface IMovementUseCases{
    create(data: newMovementDTO): Promise<Movement>;
    createMovimentations(data: newProductDTO[]): Promise<String[]>;
    findWithFilterMovements(data: filterMovementsDTO): Promise<Movement[]>;
    //getStockByProduct(data: Product): Promise<Movement[]>;
    findOne(id: number): Promise<Movement | null>;
    delete(id: number): Promise<void>;
    deleteWithSpecificProduct(idCommand: number, idProduct: number): Promise<void>;
    deleteAllProductsByCommand(idCommand: number): Promise<void>;
    deleteAllMovementationsBySpecificProduct(idCommand: number, idProduct: number): Promise<void>;
    getProductsByCommand(data: filterMovementsDTO): Promise<Movement[]>
}
