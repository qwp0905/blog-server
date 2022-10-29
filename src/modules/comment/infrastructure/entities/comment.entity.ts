import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { AccountEntity } from '../../../account/infrastructure/entities/account.entity'
import { ArticleEntity } from '../../../article/infrastructure/entities/article.entity'

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @ManyToOne(() => AccountEntity, (Account) => Account.id, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'account_id' })
  account_id: number

  @ManyToOne(() => ArticleEntity, (Article) => Article.id, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'article_id' })
  article_id: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
