import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
    BeforeInsert
} from "typeorm";

import { Pair } from "./Pair";
import { Route } from "./Route";

@Entity()
export class Quote {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column()
    name: string;

    @ManyToOne(() => Pair)
    @JoinColumn({ name: 'pair_uuid' })
    pair: Pair;

    @Column()
    volume: number;

    @Column()
    operation: string;

    @Column()
    estimatedPrice: number;

    @OneToOne(() => Route)
    @JoinColumn({ name: 'route_uuid' })
    route: Route;

    @Column({ default: false })
    used: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    expiresAt: Date;

    @BeforeInsert()
    setExpiresAt() {
        const offsetInSeconds = parseInt(process.env.EXPIRATION_TIME as string, 10);
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + offsetInSeconds);
        this.expiresAt = expiresAt;
    }


}
