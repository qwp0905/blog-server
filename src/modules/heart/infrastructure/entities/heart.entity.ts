import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { AccountEntity } from '../../../account/infrastructure/entities/account.entity'
import { ArticleEntity } from '../../../article/infrastructure/entities/article.entity'

@Entity('heart')
export class HeartEntity {
  @PrimaryGeneratedColumn()
  id: number

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
}
