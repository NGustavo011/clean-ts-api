import { loginPath } from './login-path'
import { signupPath } from './signup-path'
import { surveyPath } from './survey-path'
import { surveyResultPath } from './survey-result-path'

export const swaggerPaths = {
  '/login': loginPath,
  '/signup': signupPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
