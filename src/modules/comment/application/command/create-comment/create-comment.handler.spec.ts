import { Mock } from '../../../../../@types/test'
import { IComment } from '../../../domain/comment'
import { CommentFactory } from '../../../domain/comment.factory'
import { ICommentRepository } from '../../../domain/comment.repository.interface'
import { CreateCommentCommand, ICreateCommentCommand } from './create-comment.command'
import { CreateCommentHandler } from './create-comment.handler'

const mockCommentFactory = () => ({
  create: jest.fn()
})

const mockCommentRepository = () => ({
  insertOne: jest.fn()
})

const mockComment = () => ({})

describe('Comment-CreateComment', () => {
  let handler: CreateCommentHandler
  let commentFactory: Mock<CommentFactory>
  let commentRepository: Mock<ICommentRepository>

  beforeEach(() => {
    commentFactory = mockCommentFactory()
    commentRepository = mockCommentRepository()

    handler = new CreateCommentHandler(
      commentRepository as ICommentRepository,
      commentFactory as CommentFactory
    )
  })

  describe('TEST', () => {
    let command: ICreateCommentCommand
    let comment: Mock<IComment>

    beforeEach(() => {
      command = new CreateCommentCommand(123, 456, 'comment').context

      comment = mockComment()

      commentFactory.create.mockReturnValue(comment)
    })

    it('test', async () => {
      const result = handler.execute(command)

      await expect(result).resolves.toBeUndefined()
      expect(commentFactory.create).toBeCalledWith(123, 456, 'comment')
      expect(commentRepository.insertOne).toBeCalledWith(comment)
    })
  })
})
