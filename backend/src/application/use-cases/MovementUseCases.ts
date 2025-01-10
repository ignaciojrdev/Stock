import { IMovementUseCases } from "../../domain/interfaces/IUse-cases/IMovementUseCases";
import { IMovementRepositories } from "../../domain/interfaces/IRepositories/IMovementRepositories";
import { IProductRepositories } from "../../domain/interfaces/IRepositories/IProductRepositories";
import { newMovementDTO } from "../../domain/dtos/movement/newMovementDTO";
import { filterMovementsDTO } from "../../domain/dtos/movement/filterMovementsDTO";
import { Movement } from "../../domain/entities/Movement";
import { newProductDTO } from "../../domain/dtos/product/newProductDTO";

export class MovementUseCases implements IMovementUseCases{
    constructor(
                public movementRepositories: IMovementRepositories,
                private productRepositories: IProductRepositories,
                private commandUseCaseFindOne?: Function
    ) {}

    async create(data: newMovementDTO): Promise<Movement> {
        let checkingStockOutOperation;
        let checkingCommand;
        if(!data.product)
            throw ('O produto é um campo obrigatório.');
        
        let isProductExists = await this.productRepositories.findOne(Number(data.product));
        if(!isProductExists)
            throw ('O código do produto informado não existe.');

        if(!data.quantity)
            throw ('A quantidade é um campo obrigatório.');

        if(data.quantity <= 0)
            throw ('A quantidade é um campo que deverá ter seu valor maior que 0.');

        if(!data.type)
            throw ('O tipo é um campo obrigatório.');

        if(data.type == 'OUT'){
            await this.forbidStockOutOperation(data.product, data.quantity);
            if(data.command && this.commandUseCaseFindOne){
                try{
                    checkingCommand = this.commandUseCaseFindOne(Number(data.command));
                }catch(e: any){
                    throw(e.message);
                }
            }
        }else{
            if(data.command){
                throw('Uma comanda não pode ser utilizada para dar entrada em estoque.');
            }
        }

        await Promise.all([checkingStockOutOperation, checkingCommand]);
        return await this.movementRepositories.create(data);
    }

    async findWithFilterMovements(data: filterMovementsDTO): Promise<Movement[]>{
        const movements = await this.movementRepositories.findWithFilterMovements(data);
        return movements;
    }

    async findOne(id: number): Promise<Movement | null>{
        return await this.movementRepositories.findOne(id);
    }

    async delete(id: number): Promise<void>{
        this.movementRepositories.delete(id);
    }

    private async forbidStockOutOperation(product: string, quantity: number){
        await this.checkStockInOperationProduct(product);
        await this.checkNegativeStock(product, quantity);
    }

    private async checkNegativeStock(product: string, quantity: number): Promise<void>{
        let movementsIN = await this.movementRepositories.getMovementsLikeIn(Number(product));
        let movementsOUT = await this.movementRepositories.getMovementsLikeOut(Number(product));
        let quantityIN = movementsIN ? movementsIN.quantity : 0;
        let quantityOUT = movementsOUT ? movementsOUT.quantity : 0;
        if (
            quantity > (quantityIN - quantityOUT)
        ){
            throw ('A operação não pode ser realizada pois não existem produtos no estoque suficientes.');
        }
    }

    private async checkStockInOperationProduct(product: string): Promise<void>{
        let movementsIN = await this.movementRepositories.getMovementsLikeIn(Number(product));
        if(!movementsIN){
            throw ('Operação bloqueada. Não existe entrada de estoque para o produto.');
        }
    }

    /*public async getStockByProduct(products: Product[]): Promise<Movement[]>{
        let productsToReturn = await this.movementRepositories.getStockByProducts(products);
        return productsToReturn;
    }*/

    async createMovimentations(data: newProductDTO[]): Promise<String[]>{
        let movementationsError: String[] = [];
        for (const product of data) {
            try{
                await this.forbidStockOutOperation(String(product.id), Number(product.stock));
                for(let i = 1; i <= product.stock!; i++){
                    let productToSave = { ...product, stock: 1};
                    await this.create(this.createNewMovement(productToSave));
                }
            }catch(e: any){
                movementationsError.push(e)
            }
        }
        return movementationsError;
    }

    private createNewMovement (data: newProductDTO): newMovementDTO {
        let movement: newMovementDTO = { product: String(data.id), quantity: Number(data.stock), type: 'OUT', command: data.command }
        return movement;
    }

    async getProductsByCommand(data: filterMovementsDTO): Promise<Movement[]>{
        const products = await this.movementRepositories.getProductsByCommand(data);
        return products;
    }

    async deleteWithSpecificProduct(idCommand: number, idProduct: number): Promise<void>{
        let movement: filterMovementsDTO = {
            command: String(idCommand),
            product: String(idProduct),
            type: 'OUT'
        }
        
        let movementsForProduct = await this.findWithFilterMovements(movement);
        let maxMovementId = 0;
        if(movementsForProduct.length > 0){
            movementsForProduct.forEach(movement => {
                if(movement.id > maxMovementId){
                    maxMovementId = movement.id;
                }
            })
            return this.movementRepositories.delete(maxMovementId);
        }
        throw('Não existem movimentações específicas desse produto para essa comanda.')
    }

    async deleteAllMovementationsBySpecificProduct(idCommand: number, idProduct: number): Promise<void>{
        let movement: filterMovementsDTO = {
            command: String(idCommand),
            product: String(idProduct),
            type: 'OUT'
        }
        let movementsForProduct = await this.findWithFilterMovements(movement);
        if(movementsForProduct.length > 0){
            return this.movementRepositories.deleteAllMovementationsBySpecificProduct(movement);
        }
        throw('Não existem movimentações específicas desse produto para essa comanda.')
    }

    async deleteAllProductsByCommand(idCommand: number): Promise<void>{
        this.movementRepositories.deleteAllProductsByCommand(idCommand);
    }
}