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
    coverPhoto: string | null;

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
