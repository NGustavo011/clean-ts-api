import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'
import { type LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { type AccountModel } from '../../domain/models/account'
import { type HttpRequest } from '../protocols'

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    email: 'valid_email@mail.com',
    name: 'valid_name',
    password: 'hashed_password'
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

interface SutTypes {
  loadAccountByTokenStub: LoadAccountByToken
  sut: AuthMiddleware
}

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    loadAccountByTokenStub,
    sut
  }
}

describe('Auth Middleware', () => {
  test('Deve retornar 403 se o x-access-token não exister no headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Deve chamar o LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
  test('Deve retornar 403 se LoadAccountByToken retornar null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Deve retornar 200 se LoadAccountByToken retornar um account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })
  test('Deve retornar 500 se LoadAccountByToken lançar um erro', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
