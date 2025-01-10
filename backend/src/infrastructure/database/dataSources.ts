import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../../domain/entities/Product";
import { Movement } from "../../domain/entities/Movement";
import { Command } from "../../domain/entities/Command";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5000,
    username: "postgres",
    password: "root",
    database: "STOCK",
    entities: [Product, Movement, Command],
    synchronize: true,
    extra: {
        timezone: 'UTC', // Garanta que o banco de dados esteja usando UTC
      },
});

export const connectDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Banco de dados conectado com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados: ", error);
    }
};
