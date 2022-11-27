import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { AccountOrigin, AccountRole } from '../../../../@types/account'
import { ArticleEntity } from '../../../article/infrastructure/entities/article.entity'
import { HeartEntity } from '../../../heart/infrastructure/entities/heart.entity'

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  nickname: string

  @Column({ type: 'enum', enum: ['admin', 'guest'], default: 'guest' })
  role: AccountRole

  @Column({ type: 'enum', enum: ['local'], default: 'local' })
  origin: AccountOrigin

  @Column({ default: null })
  refresh_token: string | null

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => ArticleEntity, (Article) => Article)
  @JoinColumn()
  articles?: ArticleEntity[]

  @OneToMany(() => HeartEntity, (Heart) => Heart)
  @JoinColumn()
  hearts?: HeartEntity[]
}
