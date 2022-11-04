import { Mock } from '../../../../../@types/test'
import { IHeart } from '../../../domain/heart'
import { HeartFactory } from '../../../domain/heart.factory'
import { IHeartRepository } from '../../../domain/heart.repository.interface'
import { CreateHeartCommand, ICreateHeartCommand } from './create-heart.command'
import { CreateHeartHandler } from './create-heart.handler'

const mockHeartRepository = () => ({
  findOneByIds: jest.fn(),
  insertOne: jest.fn()
})

const mockHeartFactory = () => ({
  create: jest.fn()
})

const mockHeart = () => ({})

describe('Heart-CreateHeart', () => {
  let handler: CreateHeartHandler
  let heartRepository: Mock<IHeartRepository>
  let heartFactory: Mock<HeartFactory>

  beforeEach(() => {
    heartFactory = mockHeartFactory()
    heartRepository = mockHeartRepository()

    handler = new CreateHeartHandler(
      heartRepository as IHeartRepository,
      heartFactory as HeartFactory
    )
  })

  describe('TEST', () => {
    let command: ICreateHeartCommand
    let heart: Mock<IHeart>

    beforeEach(() => {
      command = new CreateHeartCommand(123, 456).context

      heart = mockHeart()

      heartFactory.create.mockReturnValue(heart)
    })

    it('1. 이미 존재하는 경우', async () => {
      heartRepository.findOneByIds.mockResolvedValueOnce(heart)

      const result = handler.execute(command)

      await expect(result).resolves.toBeUndefined()
      expect(heartRepository.findOneByIds).toBeCalledWith(123, 456)
      expect(heartFactory.create).not.toBeCalled()
      expect(heartRepository.insertOne).not.toBeCalled()
    })

    it('2. 없는 경우 생성', async () => {
      const result = handler.execute(command)

      await expect(result).resolves.toBeUndefined()
      expect(heartFactory.create).toBeCalledWith(123, 456)
      expect(heartRepository.insertOne).toBeCalledWith(heart)
    })
  })
})
