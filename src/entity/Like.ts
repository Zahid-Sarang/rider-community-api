import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Memories } from "./Memory";
import { User } from "./User";

@Entity({ name: "likes" })
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.likes)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Memories, (memory) => memory.likes)
    @JoinColumn({ name: "memoryId" })
    memory: Memories;
}
