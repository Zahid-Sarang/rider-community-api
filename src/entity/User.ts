import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Comment } from "./Comment";
import { Itinerary } from "./Itinerary";
import { Like } from "./Like";
import { Memories } from "./Memory";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    userName: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true, type: "varchar" })
    profilePhoto: string;

    @Column({ nullable: true, type: "varchar" })
    coverPhoto: string[] | null;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    bikeDetails: string;

    @OneToMany(() => Itinerary, (itinerary) => itinerary.user, { nullable: true })
    itineraries: Itinerary[];

    @ManyToMany(() => Itinerary, (itinerary) => itinerary.participants, { nullable: true })
    @JoinTable()
    joinedItineraries: Itinerary[];

    @OneToMany(() => Memories, (memory) => memory.user, { nullable: true })
    memories: Memories[];

    @OneToMany(() => Like, (like) => like.user, { nullable: true })
    likes: Like[];

    @OneToMany(() => Comment, (comment) => comment.user, { nullable: true })
    comments: Comment[];

    @CreateDateColumn()
    joinDate: Date;

    @UpdateDateColumn()
    lastActive: Date;
}
