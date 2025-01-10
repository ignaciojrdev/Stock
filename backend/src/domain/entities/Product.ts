import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: "text", nullable: true})
  description: string;

  @Column({ type: "float", default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor() {
    this.id = 0; // inicializa id
    this.name = ""; // inicializa name
    this.description = ""; // inicializa description
    this.price = 0; // inicializa price
    this.createdAt = new Date(); // inicializa createdAt
    this.updatedAt = new Date(); // inicializa updatedAt
  }
}
