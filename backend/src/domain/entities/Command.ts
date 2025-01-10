import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Command {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: "varchar",
        length: 10,
        enum: ["Pessoal", "Grupo"],
    })
    type: "Pessoal" | "Grupo";

    @Column({
        type: "varchar",
        length: 7,
        enum: ["Aberta", "Fechada"],
    })
    status: "Aberta" | "Fechada";

    constructor() {
        this.id = 0; // inicializa id
        this.name = ""; // inicializa name
        this.type = "Pessoal"; // inicializa type
        this.status = "Aberta"; // inicializa status
        this.createdAt = new Date(); // inicializa createdAt
        this.updatedAt = new Date(); // inicializa updatedAt
    }
}
