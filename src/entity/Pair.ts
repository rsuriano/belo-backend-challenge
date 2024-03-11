import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany
} from "typeorm";

import { Route } from "./Route";

@Entity()
export class Pair {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column()
    name: string;

    @OneToMany(() => Route, (route) => route.pair)
    routes: Route[];

    @CreateDateColumn()
    createdAt: Date;

}
