import { Request, Response } from "express";
import { IMovementUseCases } from "../../../domain/interfaces/IUse-cases/IMovementUseCases";
import { newMovementDTO } from "../../../domain/dtos/movement/newMovementDTO";
import { filterMovementsDTO } from "../../../domain/dtos/movement/filterMovementsDTO";
import { newProductDTO } from "../../../domain/dtos/product/newProductDTO";
import { Movement } from "../../../domain/entities/Movement";

export class MovementController {
    constructor(private movementUseCases: IMovementUseCases) {}

    async create(req: Request, res: Response) {
        try {
            const movementData: newMovementDTO = req.body;
            if(!Array.isArray(movementData)){
                await this.movementUseCases.create(movementData);
                res.status(201).json('Movimentação salva com sucesso.');
            }else{
                const movementData: newProductDTO[] = req.body;
                let movementationsErrors = await this.movementUseCases.createMovimentations(movementData);
                if(movementationsErrors.length > 0){
                    res.status(500).json({ message: "Erro ao criar movimentação.", movementationsErrors });
                }else{
                    res.status(201).json('Movimentação(ões) salva(s) com sucesso.');
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro ao criar movimentação.", error });
        }
    }

    async findWithFilterMovements(req: Request, res: Response) {
        try {
            const queryParams = req.query as unknown as filterMovementsDTO;
            const movementData: filterMovementsDTO = queryParams;
            const movements = await this.movementUseCases.findWithFilterMovements(movementData);
            res.json(movements);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro ao buscar movimentações.", error });
        }
    }

    async findOne(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const movement = await this.movementUseCases.findOne(Number(id));
            if (movement) {
                res.json(movement);
            } else {
                res.status(404).json({ message: "Movimentação não encontrada." });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro ao buscar movimentação.", error });
        }
    }

    async delete(req: Request, res: Response) {
        const { id, idProduct, All } = req.params;
        
        try {
            if(!idProduct){
                await this.movementUseCases.delete(Number(id));
            }else{
                if(!All){
                    await this.movementUseCases.deleteWithSpecificProduct(Number(id), Number(idProduct));
                }else{
                    await this.movementUseCases.deleteAllMovementationsBySpecificProduct(Number(id), Number(idProduct));
                }
            }
            res.json("Movimentação excluída com sucesso.");
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro ao deletar movimentação.", error });
        }
    }
}
