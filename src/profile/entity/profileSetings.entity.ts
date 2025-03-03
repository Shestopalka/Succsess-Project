import { User } from 'src/registrationUsers/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class ProfileSetings {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => User, (user) => user.setings, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'id' })
  user: User;

  @Column({ default: true })
  publicAccount: boolean;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  ApplicationLanguage: string;
}
