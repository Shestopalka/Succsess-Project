import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/registrationUsers/entities/user.entity';
@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  courseId: number;

  @ManyToOne(() => User, (user) => user.course)
  @JoinColumn({ name: 'id' })
  user: User;

  @Column()
  like: number;

  @Column()
  follow: number;

  @Column()
  repost: number;
}
