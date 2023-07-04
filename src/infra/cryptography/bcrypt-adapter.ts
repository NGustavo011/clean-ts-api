import bcrypt from 'bcrypt'
import { type Encrypter } from '../../data/protocols/cryptography/encrypter'

export class BcryptAdapter implements Encrypter {
  constructor (readonly salt: number) {}
  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
