import { ObjectId, type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { mockAddAccountParams } from '../../../../domain/test'

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
  describe('add()', () => {
    test('Deve retornar uma conta em caso de sucesso no método de add', async () => {
      const sut = makeSut()
      const account = await sut.add(mockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })
  describe('loadByEmail()', () => {
    test('Deve retornar uma conta em caso de sucesso no método de loadByEmail', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAddAccountParams())
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })
    test('Deve retornar null em caso de falha no método de loadByEmail', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })
  describe('loadByToken()', () => {
    test('Deve retornar uma conta em caso de sucesso no método de loadByToken sem o role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), {
        accessToken: 'any_token'
      }))
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })
    test('Deve retornar uma conta em caso de sucesso no método de loadByToken com a role admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), {
        accessToken: 'any_token',
        role: 'admin'
      }))
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })
    test('Deve retornar null em caso de uso de um usuário sem role tentar acessar uma ação de role necessária', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), {
        accessToken: 'any_token'
      }))
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })
    test('Deve retornar uma conta em caso de sucesso no método de loadByToken, onde o usuário é um admin e ação não precisa de rola', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), {
        accessToken: 'any_token',
        role: 'admin'
      }))
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })
    test('Deve retornar null em caso de falha no método de loadByToken', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
  describe('updateAccessToken()', () => {
    test('Deve atualizar o accessToken da conta ao executar o método updateAccessToken com sucesso', async () => {
      const sut = makeSut()
      const result = await accountCollection.insertOne(mockAddAccountParams())
      const id = result.insertedId.toString()
      await sut.updateAccessToken(id, 'any_token')
      const account = await accountCollection.findOne({ _id: new ObjectId(id) })
      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe('any_token')
    })
  })
})
