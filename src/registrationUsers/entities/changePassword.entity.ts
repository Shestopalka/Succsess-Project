import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { name } from 'ejs';

@Entity()
export class ChangePassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  changePassword: string;

  @OneToOne(() => User, (user) => user.changePass)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @CreateDateColumn()
  expiresAt: Date;
}