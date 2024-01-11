import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Memories } from "./Memory";
import { User } from "./User";

@Entity({ name: "comments" })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Memories, (memory) => memory.comments)
    @JoinColumn({ name: "memoryId" })
    memory: Memories;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
