import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    BeforeInsert
} from "typeorm";

import { Quote } from "./Quote";
import { BinanceSwapResponse } from "../types/swap";

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

    @Column("simple-json")
    binanceResponse: BinanceSwapResponse[];

    @Column({ type: "float" })
    createdAt: number;

    @BeforeInsert()
    setDates() {
        const now = Date.now() / 1000;
        this.createdAt = now;
    }

}