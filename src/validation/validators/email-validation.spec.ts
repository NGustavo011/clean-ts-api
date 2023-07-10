import { InvalidParamError } from '../../presentation/errors'
import { type EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'
import { mockEmailValidator } from '../test'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut, emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('Deve retornar um erro se o EmailValidator retornar false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'any_mail@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })
  test('Deve chamar o EmailValidator utilizando o email correto', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_mail@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
  test('Propague o erro se o EmailValidator lançar um erro', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
