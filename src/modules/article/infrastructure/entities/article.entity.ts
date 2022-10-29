import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { AccountEntity } from '../../../account/infrastructure/entities/account.entity'
import { HeartEntity } from '../../../heart/infrastructure/entities/heart.entity'
import { ArticleTagMapEntity } from './article-tag-map.entity'

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => AccountEntity, (Account) => Account.id, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'account_id' })
  account_id: number

  @Column()
  title: string

  @Column()
  content: string

  @Column({ default: 0 })
  views: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => ArticleTagMapEntity, (ArticleTagMap) => ArticleTagMap)
  @JoinColumn()
  article_tag_map?: ArticleTagMapEntity[]

  @OneToMany(() => HeartEntity, (Heart) => Heart)
  @JoinColumn()
  hearts?: HeartEntity[]
}
