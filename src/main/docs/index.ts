import { badRequest } from './components/responses/bad-request'
import { notFound } from './components/responses/not-found'
import { serverError } from './components/responses/server-error'
import { unauthorized } from './components/responses/unauthorized'
import { loginPath } from './paths/login-path'
import { accountSchema } from './schemas/account-schema'
import { errorSchema } from './schemas/error-schema'
import { loginParamsSchema } from './schemas/login-params-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  licenses: {
    name: 'MIT',
    url: 'https://opensource.org/license/mit/'
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    {
      name: 'Login'
    }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    unauthorized,
    serverError,
    notFound
  }
}
