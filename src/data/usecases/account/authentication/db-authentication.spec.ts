import { mockAuthentication, throwError } from '../../../../domain/test'
import { DbAuthentication } from './db-authentication'
import { type HashComparer, type LoadAccountByEmailRepository, type Encrypter, type UpdateAccessTokenRepository } from './db-authentication-protocols'
import { mockHashComparer, mockEncrypter, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '../../../../data/test'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeFakeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  test('Deve chamar o LoadAccountByEmailRepository com um e-mail correto', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeFakeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(mockAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
  test('Deve repassar a exceção se o LoadAccountByEmailRepository lançar um erro', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeFakeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Deve retornar vázio se o LoadAccountByEmailRepository retornar vázio', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeFakeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBeNull()
  })
  test('Deve chamar HashComparer com valores corretos', async () => {
    const { sut, hashComparerStub } = makeFakeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(mockAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_password')
  })
  test('Deve repassar a exceção se o HashComparer lançar um erro', async () => {
    const { sut, hashComparerStub } = makeFakeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Deve retornar vázio se o HashComparer retornar falso', async () => {
    const { sut, hashComparerStub } = makeFakeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => { resolve(false) }))
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBeNull()
  })
  test('Deve chamar Encrypter com um id correto', async () => {
    const { sut, encrypterStub } = makeFakeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(mockAuthentication())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })
  test('Deve repassar a exceção se o Encrypter lançar um erro', async () => {
    const { sut, encrypterStub } = makeFakeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Deve retornar o id corretamente como token se não tiver problemas', async () => {
    const { sut } = makeFakeSut()
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBe('any_token')
  })
  test('Deve chamar UpdateAccessTokenRepository com valores corretos', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeFakeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(mockAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
  test('Deve repassar a exceção se o UpdateAccessTokenRepository lançar um erro', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeFakeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
