import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) { throw new Error() }
    await sut.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  test('Deve reconectar se a conexão do mongodb cair', async () => {
    let accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()
    await sut.disconnect()
    accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()
  })
})
