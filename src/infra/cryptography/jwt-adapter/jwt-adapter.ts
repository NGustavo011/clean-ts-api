import jwt from 'jsonwebtoken'
import { type Encrypter } from '../../../data/protocols/cryptography/encrypter'
import { type Decrypter } from '../../../data/protocols/cryptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}
  async encrypt (id: string): Promise<string> {
    const accessToken = jwt.sign({ id }, this.secret)
    return await new Promise(resolve => { resolve(accessToken) })
  }

  async decrypt (value: string): Promise<string | null> {
    jwt.verify(value, this.secret)
    return await new Promise(resolve => { resolve(null) })
  }
}
