import { IComandaRepository } from "../../domain/interfaces/IRepositories/IComandaRepository";
import { CommandDTO } from "../../domain/dtos/command/CommandDTO";
import { filterMovementsDTO } from "../../domain/dtos/movement/filterMovementsDTO";
import { Command } from "../../domain/entities/Command";
import { ICommandUseCases } from '../../domain/interfaces/IUse-cases/ICommandUseCases';
import { isValidDate } from "../utils/validations/Date";

export class CommandUseCases implements ICommandUseCases{
    constructor(
        private comandaRepository: IComandaRepository,
        private movementUseCasesFindWithFilterMovements?: Function,
        private deleteAllProductsByCommand?: Function
    ) {}

    private validStatus = ['Aberta', 'Fechada'];
    private validType = ['Pessoal', 'Grupo'];

    isValidType = (data: Partial<Command>): boolean => {
        return this.validType.includes(data.type!);
    }

    isValidStatus = (data: Partial<Command>): boolean => {
        return this.validStatus.includes(data.status!);
    }

    async createCommand(data: CommandDTO): Promise<Command | null> {
        
        if(data.id){
            let existsCommand = await this.findOne(data.id);
            if(existsCommand){
                if(data.status && !this.isValidStatus(data)){
                    throw ('Insira um status de comanda válido.');
                }
        
                if(data.type && !this.isValidType(data)){
                    throw ('Insira um tipo de comanda válido.');
                }

                return await this.comandaRepository.update(data);
            }else{
                throw('A comanda não existe.');
            }
        }else{
            if(!data.name){
                throw ('O parâmetro Nome é obrigatório');
            }
            if(!isValidDate(data.createdAt)){
                data.createdAt = new Date();
            }else{
                data.createdAt = new Date(data.createdAt!);
            }
    
            if(!this.isValidStatus(data)){
                throw ('Insira um status de comanda válido.');
            }
    
            if(!this.isValidType(data)){
                throw ('Insira um tipo de comanda válido.');
            }
        }

        return await this.comandaRepository.create(data);
    }

    async findWithFilterCommands(commandData: CommandDTO): Promise<Command[]> {
        if(isValidDate(commandData.createdAt)){
            commandData.createdAt = new Date(commandData.createdAt!);
        }
        const commands = await this.comandaRepository.findWithFilterCommands(commandData);
        return commands;
    }

    async findOne(id: number): Promise<CommandDTO | null> {
        let command: CommandDTO | null = await this.comandaRepository.findOne(id);
        if(command){
            let movement: filterMovementsDTO = { command: String(id) }
            if(this.movementUseCasesFindWithFilterMovements)
                command.products = await this.movementUseCasesFindWithFilterMovements(movement);
        }
        return command;
    }

    async delete(id: number): Promise<void> {
        if(this.deleteAllProductsByCommand){
                await this.deleteAllProductsByCommand(id)
        }
        await this.comandaRepository.delete(id);
    }
}