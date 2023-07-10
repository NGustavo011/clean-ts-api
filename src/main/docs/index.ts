import { swaggerPaths } from './paths'
import { swaggerComponents } from './components'
import { swaggerSchemas } from './schemas'

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
    },
    {
      name: 'Enquete'
    }
  ],
  paths: swaggerPaths,
  schemas: swaggerSchemas,
  components: swaggerComponents
}
