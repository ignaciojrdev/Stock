import { Product } from "./Product";

export interface Movement {
    id?: number;
    product?: Product | string | number;
    quantity: number;
    type: "IN" | "OUT";
    command?: string;
    createdAt?: string;
}
