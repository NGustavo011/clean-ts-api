import { accountSchema } from './account-schema'
import { addSurveyParamsSchema } from './add-survey-params-schema'
import { errorSchema } from './error-schema'
import { loginParamsSchema } from './login-params-schema'
import { saveSurveyParamsSchema } from './save-survey-params-schema'
import { signUpParamsSchema } from './signup-params-schema'
import { surveyAnswerSchema } from './survey-answer-schema'
import { surveyResultSchema } from './survey-result-schema'
import { surveySchema } from './survey-schema'
import { surveysSchema } from './surveys-schema'

export const swaggerSchemas = {
  account: accountSchema,
  loginParams: loginParamsSchema,
  error: errorSchema,
  survey: surveySchema,
  surveys: surveysSchema,
  surveyAnswer: surveyAnswerSchema,
  signUpParams: signUpParamsSchema,
  addSurveyParams: addSurveyParamsSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  surveyResult: surveyResultSchema
}
