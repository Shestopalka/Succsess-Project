import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersProfile } from '../../profile/entity/userProfile.entity';
import { Course } from 'src/course/entity/course.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Course, (course) => course.user)
  course: Course[];

  @OneToOne(() => UsersProfile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: UsersProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
