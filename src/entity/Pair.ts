import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BeforeInsert
} from "typeorm";

import { Route } from "./Route";

@Entity()
export class Pair {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column()
    name: string;

    @OneToMany(() => Route, (route) => route.pair, { eager: true })
    routes: Route[];

    @Column({ type: "float" })
    createdAt: number;

    @BeforeInsert()
    setDates() {
        this.createdAt = Date.now() / 1000;
    }

}
