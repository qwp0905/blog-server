import { Mock } from '../../../../../@types/test'
import { IHeart } from '../../../domain/heart'
import { IHeartRepository } from '../../../domain/heart.repository.interface'
import { DeleteHeartCommand, IDeleteHeartCommand } from './delete-heart.command'
import { DeleteHeartHandler } from './delete-heart.handler'

const mockHeartRepository = (): Mock<IHeartRepository> => ({
  findOneByIds: jest.fn(),
  deleteOne: jest.fn()
})

const mockHeart = (): Mock<IHeart> => ({})

describe('Heart-DeleteHeart', () => {
  let handler: DeleteHeartHandler
  let heartRepository: Mock<IHeartRepository>

  beforeEach(() => {
    heartRepository = mockHeartRepository()

    handler = new DeleteHeartHandler(heartRepository as IHeartRepository)
  })

  describe('TEST', () => {
    let command: IDeleteHeartCommand
    let heart: Mock<IHeart>

    beforeEach(() => {
      command = new DeleteHeartCommand(123, 456).context

      heart = mockHeart()

      heartRepository.findOneByIds.mockResolvedValue(heart)
    })

    it('1. 없는 경우 삭제 안함', async () => {
      heartRepository.findOneByIds.mockResolvedValueOnce(undefined)

      const result = handler.execute(command)

      await expect(result).resolves.toBeUndefined()
      expect(heartRepository.findOneByIds).toBeCalledWith(123, 456)
      expect(heartRepository.deleteOne).not.toBeCalled()
    })

    it('2. 있는 경우 삭제', async () => {
      const result = handler.execute(command)

      await expect(result).resolves.toBeUndefined()
      expect(heartRepository.findOneByIds).toBeCalledWith(123, 456)
      expect(heartRepository.deleteOne).toBeCalledWith(heart)
    })
  })
})
