import { Collection, Db, ObjectId } from 'mongodb';
import { Maybe } from '../../common/types';
import { ClientRepository } from './client.repository';
import { Client } from '../model/client';

type ClientWithoutId = Omit<Client, 'id'>;

export class MongoDbClientRepository implements ClientRepository {
    private readonly clientsCollection: Collection<ClientWithoutId>;

    constructor(db: Db) {
        this.clientsCollection = db.collection<ClientWithoutId>('clients');
    }

    async getClientById(id: string): Promise<Maybe<Client>> {
        const objectId = new ObjectId(id);
        const client = await this.clientsCollection.findOne({ _id: objectId });

        if (client === null) {
            return undefined;
        }

        return {
            id: client._id.toString(),
            name: client.name,
            email: client.email,
            phone: client.phone,
        };
    }
}
