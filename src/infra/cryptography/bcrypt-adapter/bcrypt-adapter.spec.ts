import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  },
  async compare (): Promise<boolean> {
    return await new Promise(resolve => { resolve(true) })
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Deve chamar o método hash com os valores corretos', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })
    test('Deve retornar no método hash, a hash em caso de sucesso', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })
    test('Deve repassar o error caso o método hash lance um erro', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('compare()', () => {
    test('Deve chamar o método compare com os valores corretos', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })
    test('Deve retornar true quando a comparação for um sucesso', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBeTruthy()
    })
    test('Deve retornar false quando a comparação for uma falha', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { return false })
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBeFalsy()
    })
    test('Deve repassar o error caso o método de comparação lançar um erro', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.compare('any_value', 'any_has')
      await expect(promise).rejects.toThrow()
    })
  })
})
