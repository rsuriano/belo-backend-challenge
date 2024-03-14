import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert
} from "typeorm";

import { Pair } from "./Pair";
import { Route } from "./Route";

@Entity()
export class Quote {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @ManyToOne(() => Pair, { eager: true })
    @JoinColumn({ name: 'pair_uuid' })
    pair: Pair;

    @Column({ type: "float" })
    volume: number;

    @Column()
    operation: "BUY" | "SELL";

    @Column({ type: "float" })
    estimatedPriceBase: number;

    @Column({ type: "float" })
    estimatedPrice: number;

    @ManyToOne(() => Route, (route) => route.uuid, { eager: true })
    @JoinColumn({ name: 'route_uuid' })
    route: Route;

    @Column()
    expirationSeconds: number;

    @Column({ default: false })
    used: boolean;

    @Column({ type: "float" })
    createdAt: number;

    @Column({ type: "float" })
    expiresAt: number;

    @BeforeInsert()
    setDates() {
        const offsetInSeconds = parseInt(process.env.EXPIRATION_TIME as string, 10);

        const now = Date.now() / 1000;
        const expiresAt = now + offsetInSeconds;

        this.createdAt = this.createdAt ?? now;
        this.expiresAt = this.expiresAt ?? expiresAt;
    }

}
