// Itinerary.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Itinerary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tripTitle: string;

    @Column()
    tripDescription: string;

    @Column()
    tripDuration: string;

    @Column({ type: "timestamp" })
    startDateTime: Date;

    @Column({ type: "timestamp" })
    endDateTime: Date;

    @Column()
    startPoint: string;

    @Column()
    endingPoint: string;

    @Column()
    destinationImage: string;

    @ManyToOne(() => User, (user) => user.itineraries)
    @JoinColumn({ name: "userId" })
    user: User;
    
    @ManyToMany(() => User, (user) => user.joinedItineraries)
    @JoinTable()
    participants: User[];
}
