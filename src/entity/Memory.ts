import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { User } from "./User";

@Entity({ name: "memories" })
export class Memories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ nullable: true, type: "varchar" })
    image: string | null;

    @ManyToOne(() => User, (user) => user.memories)
    @JoinColumn({ name: "userId" })
    user: User;

    @OneToMany(() => Like, (like) => like.memory, { nullable: true })
    likes: Like[];

    @OneToMany(() => Comment, (comment) => comment.memory, { nullable: true })
    comments: Comment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
