import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VereficationEmail {
  @PrimaryGeneratedColumn()
  ReqId: number;

  @Column({ nullable: true })
  VerifyPass: string;

  @Column()
  isVerified: boolean;

  @Column()
  userId: number;

  @Column({ default: 1 })
  attempt: number;
}
