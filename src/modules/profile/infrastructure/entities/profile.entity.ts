import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { AccountEntity } from '../../../account/infrastructure/entities/account.entity'

@Entity('profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => AccountEntity, (account) => account.id, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'account_id' })
  account_id: number

  @Column()
  content: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
