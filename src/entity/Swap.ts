import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    JoinColumn
} from "typeorm";

import { Quote } from "./Quote";

@Entity()
export class Swap {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @OneToOne(() => Quote)
    @JoinColumn({ name: 'quote_uuid' })
    quote: Quote;

    @Column()
    finalPrice: number;

    @Column()
    binanceFee: number;

    @CreateDateColumn()
    createdAt: Date;

}