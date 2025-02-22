import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VereficationEmail {
  @PrimaryGeneratedColumn()
  ReqId: number;

  @Column()
  VerifyPass: string;

  @Column()
  isVerified: boolean;

  @Column()
  userId: number;

  @Column({ default: 1 })
  attempt: number;

  @Column()
  email: string;

  @Column()
  nickName: string;

  @Column()
  name: string;

  @Column()
  surname: string;
}
