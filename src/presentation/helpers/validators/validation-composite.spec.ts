import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'
import { type Validation } from './validation'

describe('Validation Composite', () => {
  test('Se qualquer depedência do Composite falhar, o erro deve ser propagado', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error | null {
        return new MissingParamError('field')
      }
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
