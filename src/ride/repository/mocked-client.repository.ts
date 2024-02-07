import { Maybe } from '../../common/types';
import { Client } from '../model/client';
import { ClientRepository } from './client.repository';

export class MockedClientRepository implements ClientRepository {
    getClientById(id: string): Promise<Maybe<Client>> {
        return Promise.resolve({
            id,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+9876543210',
        });
    }
}
