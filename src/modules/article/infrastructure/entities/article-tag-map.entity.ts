import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { ArticleEntity } from './article.entity'
import { TagEntity } from './tag.entity'

@Entity('article_tag_map')
export class ArticleTagMapEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ArticleEntity, (Article) => Article.id, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'article_id' })
  article_id: number

  @ManyToOne(() => TagEntity, (Tag) => Tag.id, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'tag_id' })
  tag_id: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
