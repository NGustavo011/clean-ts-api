import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
  test('Deve retornar um MissingParamError se a validação falhar', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Não deve retornar nada se a validação não falhar', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
