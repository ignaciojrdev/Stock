import { Product } from "../../entities/Product";

export interface newMovementDTO {
    id?: number;
    product: string;
    quantity: number;
    type: "IN" | "OUT";
    command?: string;
    createdAt?: Date;
}
