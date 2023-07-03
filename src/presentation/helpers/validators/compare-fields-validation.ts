import { InvalidParamError } from '../../errors'
import { type Validation } from './validation'
export class CompareFieldsValidation implements Validation {
  constructor (readonly fieldName: string, readonly fieldToCompareName: string) {
  }

  validate (input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
    return null
  }
}
