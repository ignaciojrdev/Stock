import { AppDataSource } from "../database/dataSources";
import { Command } from "../../domain/entities/Command";
import { IComandaRepository } from "../../domain/interfaces/IRepositories/IComandaRepository";
import { isValidDate } from "../../application/utils/validations/Date";

export class CommandRepository implements IComandaRepository {
    private comandaRepository = AppDataSource.getRepository(Command);

    private validStatus = ['Aberta', 'Fechada'];
    private validType = ['Pessoal', 'Grupo'];

    async create(data: Partial<Command>): Promise<Command> {
        const comanda = this.comandaRepository.create(data);
        return await this.comandaRepository.save(comanda);
    }

    async update(data: Partial<Command>): Promise<Command | null> {
        const command = await this.findOne(Number(data.id));
        if(command){
            await this.comandaRepository.update(Number(data.id), data);
            return await this.findOne(Number(data.id));
        }else{
            return null;
        }
    }

    isValidType = (data: Partial<Command>): boolean => {
        return this.validType.includes(data.type!);
    }

    isValidStatus = (data: Partial<Command>): boolean => {
        return this.validStatus.includes(data.status!);
    }

    async findWithFilterCommands(data: Partial<Command>): Promise<Command[]> {
        let idValue;
        let nameValue;
        let statusValue;
        let typeValue;
        let createdAtValue;
        const queryBuilder = await this.comandaRepository.createQueryBuilder('Command');

        if(!!data.id && data.id){
            idValue = String(data.id);
            queryBuilder.andWhere('Command.id = :id', { id: `${idValue}` });
            //console.log(nameValue);
        }

        if(!!data.name && data.name != ''){
            nameValue = String(data.name);
            queryBuilder.andWhere('Command.name LIKE :name', { name: `%${nameValue}%` });
            //console.log(nameValue);
        }
        
        if((!!data.status) && (this.isValidStatus(data))){
            statusValue = String(data.status); 
            queryBuilder.andWhere(
                'Command.status = :status', { status: statusValue}
            )
            //console.log(statusValue);
        }

        if((!!data.type) && (this.isValidType(data))){
            typeValue = String(data.type); 
            queryBuilder.andWhere(
                'Command.type = :type', { type: typeValue}
            )
            //console.log(typeValue);
        }

        if(!!data.createdAt && isValidDate(data.createdAt)){
            createdAtValue = new Date(data.createdAt);
            const dia = String(createdAtValue.getDate()).padStart(2, '0');
            const mes = String(createdAtValue.getMonth() + 1).padStart(2, '0');
            const ano = createdAtValue.getFullYear();
            const dataFormatada = `${dia}/${mes}/${ano}`;
            queryBuilder.andWhere('DATE(Command.createdAt) = DATE(:date)', { date: dataFormatada} )
            //console.log(dataFormatada);
        }
        const results = await queryBuilder.getMany();
        return results;
    }

    async findOne(id: number): Promise<Command | null> {
        return await this.comandaRepository.findOneBy({ id });
    }

    async delete(id: number): Promise<void> {
        await this.comandaRepository.delete(id);
    }
}
