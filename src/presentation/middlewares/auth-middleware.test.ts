import { throwError } from '../../domain/test'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { mockLoadAccountByToken } from '../test'
import { AuthMiddleware } from './auth-middleware'
import { type LoadAccountByToken, type HttpRequest } from './auth-middleware-protocols'

const mockRequest = (): HttpRequest => {
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

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
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
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })
  test('Deve retornar 403 se LoadAccountByToken retornar null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Deve retornar 200 se LoadAccountByToken retornar um account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })
  test('Deve retornar 500 se LoadAccountByToken lançar um erro', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
