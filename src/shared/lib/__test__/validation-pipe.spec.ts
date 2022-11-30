import { ValidationPipe } from '../validation-pipe'

describe('ValidationPipe', () => {
  let validationPipe: ValidationPipe

  beforeEach(() => {
    validationPipe = new ValidationPipe()
  })

  describe('1. string TEST', () => {
    it('1. falsy한 값', () => {
      expect(() => validationPipe.string()).toThrowError()
    })

    it('2. object', () => {
      expect(() => validationPipe.string({ abc: 123 })).toThrowError()
    })

    it('3. number', () => {
      expect(() => validationPipe.string(123123)).toThrowError()
    })

    it('4. ""', () => {
      expect(validationPipe.string('')).toEqual('')
    })

    it('5. 정상 검증', () => {
      expect(validationPipe.string('123123')).toBe('123123')
    })
  })

  describe('2. stringOptional TEST', () => {
    beforeEach(() => {
      jest.spyOn(validationPipe, 'string')
    })

    it('1. undefined', () => {
      expect(validationPipe.stringOptional()).toBeUndefined()
      expect(validationPipe.string).not.toBeCalled()
    })

    it('2. string 메서드 호출', () => {
      expect(() => validationPipe.stringOptional(123123)).toThrowError()
      expect(validationPipe.string).toBeCalledWith(123123)
    })
  })

  describe('3. number TEST', () => {
    it('1. 0', () => {
      expect(validationPipe.number(0)).toBe(0)
    })

    it('2. NaN', () => {
      expect(() => validationPipe.number(NaN)).toThrowError()
    })

    it('3. string', () => {
      expect(() => validationPipe.number('123')).toThrowError()
    })

    it('4. object', () => {
      expect(() => validationPipe.number({ 123123: 123123 })).toThrowError()
    })

    it('5. 정상 검증', () => {
      expect(validationPipe.number(123123)).toBe(123123)
    })
  })

  describe('3. numberOptional TEST', () => {
    beforeEach(() => {
      jest.spyOn(validationPipe, 'number')
    })

    it('1. undefined', () => {
      expect(validationPipe.numberOptional()).toBeUndefined()
      expect(validationPipe.number).not.toBeCalled()
    })

    it('2. number 메서드 호출', () => {
      expect(validationPipe.numberOptional(123123)).toBe(123123)
      expect(validationPipe.number).toBeCalledWith(123123)
    })
  })

  describe('4. numberPipe TEST', () => {
    beforeEach(() => {
      jest.spyOn(validationPipe, 'number')
    })

    it('1. undefined', () => {
      expect(() => validationPipe.numberPipe()).toThrowError()
      expect(validationPipe.number).toBeCalledWith(NaN)
    })

    it('2. string', () => {
      expect(() => validationPipe.numberPipe('sdf')).toThrowError()
      expect(validationPipe.number).toBeCalledWith(NaN)
    })

    it('3. string number', () => {
      expect(validationPipe.numberPipe('1122')).toBe(1122)
      expect(validationPipe.number).toBeCalledWith(1122)
    })
  })

  describe('5. numberOptionalPipe TEST', () => {
    beforeEach(() => {
      jest.spyOn(validationPipe, 'numberPipe').mockReturnValue(123123)
    })

    it('1. undefined', () => {
      expect(validationPipe.numberOptionalPipe()).toBeUndefined()
      expect(validationPipe.numberPipe).not.toBeCalled()
    })

    it('2. numberPipe 메서드 호출', () => {
      expect(validationPipe.numberOptionalPipe('112233')).toBe(123123)
      expect(validationPipe.numberPipe).toBeCalledWith('112233')
    })
  })

  describe('6. boolean TEST', () => {
    it('1. not boolean', () => {
      expect(() => validationPipe.boolean()).toThrowError()
    })

    it('2. boolean', () => {
      expect(validationPipe.boolean(false)).toBe(false)
    })
  })

  describe('7. enum TEST', () => {
    it('1. string 아닌 경우', () => {
      expect(() => validationPipe.enum(192873, ['1', '2'])).toThrowError()
      expect(() => validationPipe.enum(null, ['1', '2'])).toThrowError()
    })

    it('2. enum이 아닌경우', () => {
      expect(() => validationPipe.enum('not_enum', ['enum1', 'enum2'])).toThrowError()
    })

    it('3. 정상 검증', () => {
      expect(validationPipe.enum('123123', ['123123', '1212'])).toBe('123123')
    })
  })

  describe('8. array TEST', () => {
    it('1. falsy', () => {
      expect(() => validationPipe.array()).toThrowError()
      expect(() => validationPipe.array(null)).toThrowError()
      expect(() => validationPipe.array(NaN)).toThrowError()
      expect(() => validationPipe.array('')).toThrowError()
    })

    it('2. 빈 배열', () => {
      expect(() => validationPipe.array([])).toThrowError()
    })

    it('3. 다른 타입', () => {
      expect(() => validationPipe.array(123123)).toThrowError()
      expect(() => validationPipe.array('123123')).toThrowError()
      expect(() => validationPipe.array({ abc: 123123 })).toThrowError()
    })

    it('4. 정상 작동', () => {
      expect(validationPipe.array([1, 2, 3], 5)).toEqual([1, 2, 3])
    })

    it('5. 길이 검사', () => {
      expect(() => validationPipe.array([1, 2, 3], 2)).toThrowError()
    })
  })

  describe('9. arrayOptional TEST', () => {
    beforeEach(() => {
      jest.spyOn(validationPipe, 'array').mockReturnValue([123123])
    })

    it('1. undefined or null', () => {
      expect(validationPipe.arrayOptional()).toBeUndefined()
      expect(validationPipe.arrayOptional(null)).toBeUndefined()
      expect(validationPipe.array).not.toBeCalled()
    })

    it('2. array 메서드 호출', () => {
      expect(validationPipe.arrayOptional([1, 2, 3], 5)).toEqual([123123])
      expect(validationPipe.array).toBeCalledWith([1, 2, 3], 5)
    })
  })

  describe('10. stringArray TEST', () => {
    beforeEach(() => {
      jest.spyOn(validationPipe, 'array').mockImplementation((a) => a as any)
      jest.spyOn(validationPipe, 'string').mockImplementation((a) => a as any)
    })

    it('1. 메서드 호출', () => {
      expect(validationPipe.stringArray(['1', '2', '3'], 5)).toEqual(['1', '2', '3'])
      expect(validationPipe.array).toBeCalledWith(['1', '2', '3'], 5)
      expect(validationPipe.string).toBeCalledWith('1')
      expect(validationPipe.string).toBeCalledWith('2')
      expect(validationPipe.string).toBeCalledWith('3')
    })
  })

  describe('11. stringArrayOptional', () => {
    beforeEach(() => {
      jest.spyOn(validationPipe, 'stringArray').mockImplementation((a) => a as any)
    })

    it('1. undefined or null', () => {
      expect(validationPipe.stringArrayOptional()).toBeUndefined()
      expect(validationPipe.stringArrayOptional(null)).toBeUndefined()
      expect(validationPipe.stringArray).not.toBeCalled()
    })

    it('2. stringArray 메서드 호출', () => {
      expect(validationPipe.stringArrayOptional(['1', '2', '3'], 5)).toEqual([
        '1',
        '2',
        '3'
      ])
      expect(validationPipe.stringArray).toBeCalledWith(['1', '2', '3'], 5)
    })
  })

  describe('12. numberArray', () => {
    beforeEach(() => {
      jest.spyOn(validationPipe, 'array').mockImplementation((a) => a as any)
      jest.spyOn(validationPipe, 'number').mockImplementation((a) => a as any)
    })

    it('1. 메서드 호출', () => {
      expect(validationPipe.numberArray([1, 2, 3], 5)).toEqual([1, 2, 3])
      expect(validationPipe.array).toBeCalledWith([1, 2, 3], 5)
      expect(validationPipe.number).toBeCalledWith(1)
      expect(validationPipe.number).toBeCalledWith(2)
      expect(validationPipe.number).toBeCalledWith(3)
    })
  })

  describe('13. numberArrayOptional', () => {
    beforeEach(() => {
      jest.spyOn(validationPipe, 'numberArray').mockImplementation((a) => a as any)
    })

    it('1. undefined or null', () => {
      expect(validationPipe.numberArrayOptional()).toBeUndefined()
      expect(validationPipe.numberArrayOptional(null)).toBeUndefined()
      expect(validationPipe.numberArray).not.toBeCalled()
    })

    it('2. numberArray 메서드 호출', () => {
      expect(validationPipe.numberArrayOptional([1, 2, 3], 5)).toEqual([1, 2, 3])
      expect(validationPipe.numberArray).toBeCalledWith([1, 2, 3], 5)
    })
  })

  describe('14. exists TEST', () => {
    it('1. falsy', () => {
      expect(() => validationPipe.exists(undefined)).toThrowError()
      expect(() => validationPipe.exists(null)).toThrowError()
      expect(() => validationPipe.exists(NaN)).toThrowError()
    })

    it('2. 정상', () => {
      expect(validationPipe.exists(123)).toEqual(123)
      expect(validationPipe.exists({ 123: 123 })).toEqual({ 123: 123 })
      expect(validationPipe.exists([])).toEqual([])
      expect(validationPipe.exists('122')).toEqual('122')
    })
  })
})
