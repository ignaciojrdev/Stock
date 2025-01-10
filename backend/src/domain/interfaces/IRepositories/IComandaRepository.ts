import { Command } from "../../entities/Command";

export interface IComandaRepository {
    create(data: Partial<Command>): Promise<Command>;
    update(data: Partial<Command>): Promise<Command | null>;
    findWithFilterCommands(data: Partial<Command>): Promise<Command[]>;
    findOne(id: number): Promise<Command | null>;
    delete(id: number): Promise<void>;
}
