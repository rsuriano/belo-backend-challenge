import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";

import { Pair } from "./Pair";

@Entity()
export class Route {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column()
    name: string;

    @Column("simple-json")
    path: {
        binancePair: string;
        direction: "DIRECT" | "INVERTED";
    }[];

    @ManyToOne(() => Pair, (pair) => pair.routes)
    @JoinColumn({ name: 'pair_uuid' })
    pair: Pair;

    @CreateDateColumn()
    created_at: Date;

}
