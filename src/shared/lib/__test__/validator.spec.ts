import { Validator } from '../validator'

describe('Validator', () => {
  let validator: Validator

  beforeEach(() => {
    validator = new Validator()
  })

  describe('1. string TEST', () => {
    it('1. falsy한 값', () => {
      expect(() => validator.string()).toThrowError()
    })

    it('2. object', () => {
      expect(() => validator.string({ abc: 123 })).toThrowError()
    })

    it('3. number', () => {
      expect(() => validator.string(123123)).toThrowError()
    })

    it('4. ""', () => {
      expect(() => validator.string('')).toThrowError()
    })

    it('5. 정상 검증', () => {
      expect(validator.string('123123')).toBe('123123')
    })
  })

  describe('2. stringOptional TEST', () => {
    beforeEach(() => {
      jest.spyOn(validator, 'string')
    })

    it('1. undefined', () => {
      expect(validator.stringOptional()).toBeUndefined()
      expect(validator.string).not.toBeCalled()
    })

    it('2. string 메서드 호출', () => {
      expect(() => validator.stringOptional(123123)).toThrowError()
      expect(validator.string).toBeCalledWith(123123)
    })
  })

  describe('3. number TEST', () => {
    it('1. 0', () => {
      expect(validator.number(0)).toBe(0)
    })

    it('2. NaN', () => {
      expect(() => validator.number(NaN)).toThrowError()
    })

    it('3. string', () => {
      expect(() => validator.number('123')).toThrowError()
    })

    it('4. object', () => {
      expect(() => validator.number({ 123123: 123123 })).toThrowError()
    })

    it('5. 정상 검증', () => {
      expect(validator.number(123123)).toBe(123123)
    })
  })

  describe('3. numberOptional TEST', () => {
    beforeEach(() => {
      jest.spyOn(validator, 'number')
    })

    it('1. undefined', () => {
      expect(validator.numberOptional()).toBeUndefined()
      expect(validator.number).not.toBeCalled()
    })

    it('2. number 메서드 호출', () => {
      expect(validator.numberOptional(123123)).toBe(123123)
      expect(validator.number).toBeCalledWith(123123)
    })
  })

  describe('4. numberPipe TEST', () => {
    beforeEach(() => {
      jest.spyOn(validator, 'number')
    })

    it('1. undefined', () => {
      expect(() => validator.numberPipe()).toThrowError()
      expect(validator.number).toBeCalledWith(NaN)
    })

    it('2. string', () => {
      expect(() => validator.numberPipe('sdf')).toThrowError()
      expect(validator.number).toBeCalledWith(NaN)
    })

    it('3. string number', () => {
      expect(validator.numberPipe('1122')).toBe(1122)
      expect(validator.number).toBeCalledWith(1122)
    })
  })

  describe('5. numberOptionalPipe TEST', () => {
    beforeEach(() => {
      jest.spyOn(validator, 'numberPipe').mockReturnValue(123123)
    })

    it('1. undefined', () => {
      expect(validator.numberOptionalPipe()).toBeUndefined()
      expect(validator.numberPipe).not.toBeCalled()
    })

    it('2. numberPipe 메서드 호출', () => {
      expect(validator.numberOptionalPipe('112233')).toBe(123123)
      expect(validator.numberPipe).toBeCalledWith('112233')
    })
  })

  describe('6. boolean TEST', () => {
    it('1. not boolean', () => {
      expect(() => validator.boolean()).toThrowError()
    })

    it('2. boolean', () => {
      expect(validator.boolean(false)).toBe(false)
    })
  })

  describe('7. enum TEST', () => {
    it('1. string 아닌 경우', () => {
      expect(() => validator.enum(192873, ['1', '2'])).toThrowError()
      expect(() => validator.enum(null, ['1', '2'])).toThrowError()
    })

    it('2. enum이 아닌경우', () => {
      expect(() => validator.enum('not_enum', ['enum1', 'enum2'])).toThrowError()
    })

    it('3. 정상 검증', () => {
      expect(validator.enum('123123', ['123123', '1212'])).toBe('123123')
    })
  })

  describe('8. array TEST', () => {
    it('1. falsy', () => {
      expect(() => validator.array()).toThrowError()
      expect(() => validator.array(null)).toThrowError()
      expect(() => validator.array(NaN)).toThrowError()
      expect(() => validator.array('')).toThrowError()
    })

    it('2. 빈 배열', () => {
      expect(() => validator.array([])).toThrowError()
    })

    it('3. 다른 타입', () => {
      expect(() => validator.array(123123)).toThrowError()
      expect(() => validator.array('123123')).toThrowError()
      expect(() => validator.array({ abc: 123123 })).toThrowError()
    })

    it('4. 정상 작동', () => {
      expect(validator.array([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('5. 길이 검사', () => {
      expect(() => validator.array([1, 2, 3], 2)).toThrowError()
    })
  })

  describe('9. arrayOptional TEST', () => {
    beforeEach(() => {
      jest.spyOn(validator, 'array').mockReturnValue([123123])
    })

    it('1. undefined or null', () => {
      expect(validator.arrayOptional()).toBeUndefined()
      expect(validator.arrayOptional(null)).toBeUndefined()
      expect(validator.array).not.toBeCalled()
    })

    it('2. array 메서드 호출', () => {
      expect(validator.arrayOptional([1, 2, 3], 5)).toEqual([123123])
      expect(validator.array).toBeCalledWith([1, 2, 3], 5)
    })
  })

  describe('10. stringArray TEST', () => {
    beforeEach(() => {
      jest.spyOn(validator, 'array').mockImplementation((a) => a as any)
      jest.spyOn(validator, 'string').mockImplementation((a) => a as any)
    })

    it('1. 메서드 호출', () => {
      expect(validator.stringArray(['1', '2', '3'], 5)).toEqual(['1', '2', '3'])
      expect(validator.array).toBeCalledWith(['1', '2', '3'], 5)
      expect(validator.string).toBeCalledWith('1')
      expect(validator.string).toBeCalledWith('2')
      expect(validator.string).toBeCalledWith('3')
    })
  })

  describe('11. stringArrayOptional', () => {
    beforeEach(() => {
      jest.spyOn(validator, 'stringArray').mockImplementation((a) => a as any)
    })

    it('1. undefined or null', () => {
      expect(validator.stringArrayOptional()).toBeUndefined()
      expect(validator.stringArrayOptional(null)).toBeUndefined()
      expect(validator.stringArray).not.toBeCalled()
    })

    it('2. stringArray 메서드 호출', () => {
      expect(validator.stringArrayOptional(['1', '2', '3'], 5)).toEqual(['1', '2', '3'])
      expect(validator.stringArray).toBeCalledWith(['1', '2', '3'], 5)
    })
  })

  describe('12. numberArray', () => {
    beforeEach(() => {
      jest.spyOn(validator, 'array').mockImplementation((a) => a as any)
      jest.spyOn(validator, 'number').mockImplementation((a) => a as any)
    })

    it('1. 메서드 호출', () => {
      expect(validator.numberArray([1, 2, 3], 5)).toEqual([1, 2, 3])
      expect(validator.array).toBeCalledWith([1, 2, 3], 5)
      expect(validator.number).toBeCalledWith(1)
      expect(validator.number).toBeCalledWith(2)
      expect(validator.number).toBeCalledWith(3)
    })
  })

  describe('13. numberArrayOptional', () => {
    beforeEach(() => {
      jest.spyOn(validator, 'numberArray').mockImplementation((a) => a as any)
    })

    it('1. undefined or null', () => {
      expect(validator.numberArrayOptional()).toBeUndefined()
      expect(validator.numberArrayOptional(null)).toBeUndefined()
      expect(validator.numberArray).not.toBeCalled()
    })

    it('2. numberArray 메서드 호출', () => {
      expect(validator.numberArrayOptional([1, 2, 3], 5)).toEqual([1, 2, 3])
      expect(validator.numberArray).toBeCalledWith([1, 2, 3], 5)
    })
  })
})
