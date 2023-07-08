import { MongoClient, type Collection } from 'mongodb'
export const MongoHelper = {
  client: MongoClient,
  uri: String,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = new MongoClient(uri)
    await this.client.connect()
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  mongoMap: (data: any): any => {
    const { _id, ...collectionWithoutId } = data
    return Object.assign({}, collectionWithoutId, { id: _id.toString() })
  },

  mongoMapCollection (collection: any[]): any[] {
    return collection.map(c => MongoHelper.mongoMap(c))
  }

}
