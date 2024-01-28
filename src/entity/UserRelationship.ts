// user-relationship.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "user_relationships" })
export class UserRelationship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: "follower_id" })
  follower: User;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: "followed_id" })
  followed: User;

  @CreateDateColumn()
  followDate: Date;

  @UpdateDateColumn()
  lastActive: Date;
}
