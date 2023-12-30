import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    profilePhoto: string;

    @Column({ nullable: true })
    coverPhoto: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    bikeDetails: string;

    @CreateDateColumn()
    joinDate: Date;

    @UpdateDateColumn()
    lastActive: Date;
}
