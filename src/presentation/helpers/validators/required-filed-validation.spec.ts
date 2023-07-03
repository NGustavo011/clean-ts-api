import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  test('Deve retornar um MissingParamError se a validação falhar', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Não deve retornar nada se a validação não falhar', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
