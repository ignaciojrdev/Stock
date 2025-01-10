import { Product } from "../../../domain/entities/Product";

export interface CommandDTO {
    id?: number;
    name?: string;
    type?: "Pessoal" | "Grupo";
    status?: "Aberta" | "Fechada";
    createdAt?: Date;
    products?: Product[]
}
