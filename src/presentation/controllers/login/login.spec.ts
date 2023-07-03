import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return { sut }
}

describe('Login Controller', () => {
  test('Deve retornar o status code 400 se o e-mail não for fornecido', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Deve retornar o status code 400 se a senha não for fornecida', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
