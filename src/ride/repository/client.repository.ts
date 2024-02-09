import { Maybe } from '../../common/types';
import { Client } from '../model/client';

export interface ClientRepository {
    getClientById(id: string): Promise<Maybe<Client>>;
}
