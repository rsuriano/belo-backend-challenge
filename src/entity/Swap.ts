import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    BeforeInsert
} from "typeorm";

import { Quote } from "./Quote";

@Entity()
export class Swap {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @OneToOne(() => Quote)
    @JoinColumn({ name: 'quote_uuid' })
    quote: Quote;

    @Column({ type: "float" })
    finalPrice: number;

    @Column({ type: "float" })
    binanceFee: number;

    @Column({ type: "float" })
    createdAt: number;

    @BeforeInsert()
    setDates() {
        this.createdAt = Date.now() / 1000;
    }

}