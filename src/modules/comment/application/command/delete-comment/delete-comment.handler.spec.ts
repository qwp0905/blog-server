import { Mock } from '../../../../../@types/test'
import { IComment } from '../../../domain/comment'
import { ICommentRepository } from '../../../domain/comment.repository.interface'
import { DeleteCommentCommand, IDeleteCommentCommand } from './delete-comment.command'
import { DeleteCommentHandler } from './delete-comment.handler'

const mockCommentRepository = () => ({
  findOneById: jest.fn(),
  deleteOne: jest.fn()
})

const mockComment = () => ({})

describe('Comment-DeleteComment', () => {
  let handler: DeleteCommentHandler
  let commentRepository: Mock<ICommentRepository>

  beforeEach(() => {
    commentRepository = mockCommentRepository()

    handler = new DeleteCommentHandler(commentRepository as ICommentRepository)
  })

  describe('TEST', () => {
    let command: IDeleteCommentCommand
    let comment: Mock<IComment>

    beforeEach(() => {
      command = new DeleteCommentCommand(123, 456).context

      comment = mockComment()

      commentRepository.findOneById.mockResolvedValue(comment)
    })

    it('1. 댓글없으면 에러 반환', async () => {
      commentRepository.findOneById.mockResolvedValueOnce(undefined)

      const result = handler.execute(command)

      await expect(result).rejects.toThrowError()
      expect(commentRepository.findOneById).toBeCalledWith(456, 123)
      expect(commentRepository.deleteOne).not.toBeCalled()
    })

    it('2. 정상 삭제', async () => {
      const result = handler.execute(command)

      await expect(result).resolves.toBeUndefined()
      expect(commentRepository.findOneById).toBeCalledWith(456, 123)
      expect(commentRepository.deleteOne).toBeCalledWith(comment)
    })
  })
})
