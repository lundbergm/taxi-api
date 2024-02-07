import { MongoClient, ObjectId } from 'mongodb';

// Clients
const clients = [
    {
        id: 'c10000000000000000000000',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
    },
    {
        id: 'c20000000000000000000000',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+9876543210',
    },
    {
        id: 'c30000000000000000000000',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+1122334455',
    },
    {
        id: 'c40000000000000000000000',
        name: 'Emily White',
        email: 'emily.white@example.com',
        phone: '+9988776655',
    },
    {
        id: 'c50000000000000000000000',
        name: 'David Brown',
        email: 'david.brown@example.com',
        phone: '+5544332211',
    },
];

// Fleets
const fleets = [
    {
        id: 'f10000000000000000000000',
        name: 'City Cabs',
        email: 'citycabs@example.com',
        phone: '+1112223333',
    },
    {
        id: 'f20000000000000000000000',
        name: 'Quick Rides',
        email: 'quickrides@example.com',
        phone: '+4445556666',
    },
    {
        id: 'f30000000000000000000000',
        name: 'Metro Taxis',
        email: 'metrotaxis@example.com',
        phone: '+7778889999',
    },
    {
        id: 'f40000000000000000000000',
        name: 'Swift Transits',
        email: 'swifttransits@example.com',
        phone: '+1234567890',
    },
    {
        id: 'f50000000000000000000000',
        name: 'Express Cars',
        email: 'expresscars@example.com',
        phone: '+9876543210',
    },
];

// Rides requests with bids and without bids
const rides = [
    {
        id: '1',
        clientId: 'c10000000000000000000000',
        pickupLocation: '123 Main St',
        dropoffLocation: '456 Elm St',
        proposedPrice: 20,
        bids: [
            {
                id: 'b10000000000000000000000',
                fleetId: 'f10000000000000000000000',
                bidAmount: 18,
            },
            {
                id: 'b20000000000000000000000',
                fleetId: 'f20000000000000000000000',
                bidAmount: 22,
            },
        ],
    },
    {
        id: '2',
        clientId: 'c20000000000000000000000',
        pickupLocation: '789 Oak St',
        dropoffLocation: '101 Pine St',
        proposedPrice: 25,
        bids: [
            {
                id: 'b10000000000000000000000',
                fleetId: 'f10000000000000000000000',
                bidAmount: 23,
            },
            {
                id: 'b20000000000000000000000',
                fleetId: 'f20000000000000000000000',
                bidAmount: 26,
            },
            {
                id: 'b30000000000000000000000',
                fleetId: 'f40000000000000000000000',
                bidAmount: 25,
            },
        ],
    },
    {
        id: '3',
        clientId: 'c30000000000000000000000',
        pickupLocation: '456 Elm St',
        dropoffLocation: '789 Oak St',
        proposedPrice: 18,
        bids: [],
    },
    {
        id: '4',
        clientId: 'c40000000000000000000000',
        pickupLocation: '101 Pine St',
        dropoffLocation: '123 Main St',
        proposedPrice: 30,
        bids: [],
    },
];

const MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017';

const CLIENTS_COLLECTION = 'clients';
const FLEETS_COLLECTION = 'fleets';
const RIDES_COLLECTION = 'rides';
const OBJECT_ID_LENGTH = 24;

function toObjectId(record: { id: string } & Record<string, unknown>) {
    const { id, ...rest } = record;
    const paddedId = id.padEnd(OBJECT_ID_LENGTH, '0').substring(0, OBJECT_ID_LENGTH);

    return { ...rest, _id: new ObjectId(paddedId) };
}

async function seed() {
    const dbClient = new MongoClient(MONGODB_CONNECTION_STRING);
    const db = dbClient.db('taxi-service');
    const collections = (await db.listCollections().toArray()).map((collection) => collection.name);

    const clientsCollection = db.collection('clients');
    if (collections.includes(CLIENTS_COLLECTION)) {
        await clientsCollection.drop();
    }

    const clientsWithIds = clients.map(toObjectId);
    await clientsCollection.insertMany(clientsWithIds);

    const fleetsCollection = db.collection('fleets');
    if (collections.includes(FLEETS_COLLECTION)) {
        await fleetsCollection.drop();
    }

    const fleetsWithIds = fleets.map(toObjectId);
    await fleetsCollection.insertMany(fleetsWithIds);

    const ridesCollection = db.collection('rides');
    if (collections.includes(RIDES_COLLECTION)) {
        await ridesCollection.drop();
    }

    const ridesWithIds = rides.map(toObjectId);
    await ridesCollection.insertMany(ridesWithIds);
}

seed()
    .then(() => {
        console.log('Seeding complete');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error seeding', err);
        process.exit(1);
    });
