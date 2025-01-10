import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Movement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Product, (product) => product.id)
  product: string; // Relacionado ao comando externo, pode ser nulo.

  @Column({ type: "int" })
  quantity: number;

  @Column()
  type: "IN" | "OUT"; // 'IN' para entrada, 'OUT' para saída

  @Column({ nullable: true })
  command: string; // Relacionado ao comando externo, pode ser nulo.

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    this.id = 0;
    this.product = '';
    this.quantity = 0;
    this.type = 'IN';
    this.command = '';
    this.createdAt = new Date();
  }
}
