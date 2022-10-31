import { Mock } from '../../../../../@types/test'
import { IComment } from '../../../domain/comment'
import { ICommentRepository } from '../../../domain/comment.repository.interface'
import { IUpdateCommentCommand, UpdateCommentCommand } from './update-comment.command'
import { UpdateCommentHandler } from './update-comment.handler'

const mockCommentRepository = () => ({
  findOneById: jest.fn(),
  updateOne: jest.fn()
})

const mockComment = () => ({
  update: jest.fn()
})

describe('Comment-UpdateComment', () => {
  let handler: UpdateCommentHandler
  let commentRepository: Mock<ICommentRepository>

  beforeEach(() => {
    commentRepository = mockCommentRepository()

    handler = new UpdateCommentHandler(commentRepository as ICommentRepository)
  })

  describe('TEST', () => {
    let command: IUpdateCommentCommand
    let comment: Mock<IComment>

    beforeEach(() => {
      command = new UpdateCommentCommand(123, 456, 'content').context

      comment = mockComment()

      commentRepository.findOneById.mockResolvedValue(comment)
    })

    it('1. 댓글이 없다면 에러 반환', async () => {
      commentRepository.findOneById.mockResolvedValueOnce(undefined)

      const result = handler.execute(command)
      await expect(result).rejects.toThrowError()
      expect(commentRepository.findOneById).toBeCalledWith(456, 123)
      expect(comment.update).not.toBeCalled()
      expect(commentRepository.updateOne).not.toBeCalled()
    })

    it('2. 정상 업데이트', async () => {
      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()
      expect(commentRepository.findOneById).toBeCalledWith(456, 123)
      expect(comment.update).toBeCalledWith('content')
      expect(commentRepository.updateOne).toBeCalledWith(comment)
    })
  })
})
