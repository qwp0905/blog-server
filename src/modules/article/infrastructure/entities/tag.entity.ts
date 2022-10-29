import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { ArticleTagMapEntity } from './article-tag-map.entity'

@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  tag_name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => ArticleTagMapEntity, (ArticleTagMap) => ArticleTagMap)
  @JoinColumn()
  article_tag_map?: ArticleTagMapEntity[]
}
