import { type Validation, type HttpRequest } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest } from '../../../helpers/http/http-helper'

interface SutTypes {
  validationStub: Validation
  sut: AddSurveyController
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  }
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('AddSurvey Controller', () => {
  test('Deve chamar o Validation com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Deve retornar o status code 400 se o Validation lançar um erro', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
