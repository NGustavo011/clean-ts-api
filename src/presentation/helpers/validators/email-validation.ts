import { InvalidParamError } from '../../errors'
import { type EmailValidator } from '../../protocols/email-validator'
import { type Validation } from './validation'
export class EmailValidation implements Validation {
  constructor (readonly fieldName: string, readonly emailValidator: EmailValidator) {
  }

  validate (input: any): Error | null {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName])
    if (!isValidEmail) { return new InvalidParamError(this.fieldName) }
    return null
  }
}
