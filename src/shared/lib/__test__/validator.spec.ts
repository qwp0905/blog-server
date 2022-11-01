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
      expect(() => validator.number({ '123123': 123123 })).toThrowError()
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
})
