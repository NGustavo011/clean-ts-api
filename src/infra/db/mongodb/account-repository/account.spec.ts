import { ObjectId, type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Deve retornar uma conta em caso de sucesso no método de add', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_mail@mail.com')
    expect(account.password).toBe('any_password')
  })
  test('Deve retornar uma conta em caso de sucesso no método de loadByEmail', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_mail@mail.com')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('any_name')
    expect(account?.email).toBe('any_mail@mail.com')
    expect(account?.password).toBe('any_password')
  })
  test('Deve retornar null em caso de falha no método de loadByEmail', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_mail@mail.com')
    expect(account).toBeFalsy()
  })
  test('Deve atualizar o accessToken da conta ao executar o método updateAccessToken com sucesso', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
    const id = result.insertedId.toString()
    await sut.updateAccessToken(id, 'any_token')
    const account = await accountCollection.findOne({ _id: new ObjectId(id) })
    expect(account).toBeTruthy()
    expect(account?.accessToken).toBe('any_token')
  })
})
