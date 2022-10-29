import { FindTagsResult } from '../../application/query/find-tags/find-tags.query'

export class FindTagsResponse implements FindTagsResult {
  tag_name: string
  quantity: number
}
