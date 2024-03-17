import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert
} from "typeorm";

import { Pair } from "./Pair";
import { RouteSegment } from "../types/route";

@Entity()
export class Route {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column()
    name: string;

    @Column("simple-json")
    path: RouteSegment[];

    @ManyToOne(() => Pair, (pair) => pair.routes)
    @JoinColumn({ name: "pair_uuid" })
    pair: Pair;

    @Column({ type: "float" })
    createdAt: number;

    @BeforeInsert()
    setDates() {
        this.createdAt = Date.now() / 1000;
    }

}
