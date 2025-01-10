import { Request, Response } from "express";
import { CommandDTO } from "../../../domain/dtos/command/CommandDTO";
import { ICommandUseCases } from "../../../domain/interfaces/IUse-cases/ICommandUseCases";

export class CommandController {
    constructor(private commandUseCases: ICommandUseCases) {}

    async create(req: Request, res: Response) {
        try {
            const commandData: CommandDTO = req.body;
            const command = await this.commandUseCases.createCommand(commandData);
            res.status(201).json(command);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro ao criar comanda.", error });
        }
    }

    async findWithFilter(req: Request, res: Response) {
        try {
            const queryParams = req.query as unknown as CommandDTO;
            const commandData: CommandDTO = queryParams;
            const commands = await this.commandUseCases.findWithFilterCommands(commandData);
            res.json(commands);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro ao buscar comandas.", error });
        }
    }

    async findOne(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const command = await this.commandUseCases.findOne(Number(id));
            if (command) {
                res.json(command);
            } else {
                res.status(404).json({ message: "Comanda não encontrada." });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro ao buscar comanda.", error });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const commands = await this.commandUseCases.delete(Number(id));
            res.json(commands);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro ao buscar comanda.", error });
        }
    }
}
