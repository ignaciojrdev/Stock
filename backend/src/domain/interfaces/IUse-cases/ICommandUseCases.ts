import { Command } from "../../entities/Command";
import { CommandDTO } from "../../dtos/command/CommandDTO";

export interface ICommandUseCases{
    createCommand(data: CommandDTO): Promise<Command | null>;
    findWithFilterCommands(data: CommandDTO): Promise<Command[]>;
    findOne(id: number): Promise<CommandDTO | null>;
    delete(id: number): Promise<void>;
}
