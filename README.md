# taxi-api

Simple REST API for taxi rides and bids.

## Environment variables

The following environment variables are available. The defaults can be found in the file `.env.defaults`.

| Name                    | Description                        |
| ----------------------- | ---------------------------------- |
| MONGO_CONNECTION_STRING | URL to the Mongo database          |
| API_MODE                | API mode, either `MOCK` or `MONGO` |
| PORT                    | Server port number                 |

## Run locally

There are two different ways to run this application locally.

### docker-compose

The easiest way to run this application is to use docker-compose.

```console
$ docker-compose up
```

This will start the application and the database in separate containers.

For clean up, run the following command.

```console
$ docker-compose down
```

### ts-node-dev

You can also run the application transpiled with ts-node-dev with hot reloading together with a local database in docker.

```console
$ npm install
$ npm run db:start
$ npm run start
```

For clean up, run the following command.

```console
$ npm run db:stop
```

### Seed the database

For development, you can seed the database with some test data. This is applicable for both methods of running the application. Please note that this will remove all existing data in the database and that it requires package installation.

```console
$ npm install
$ npm run seed
```

## Endpoints

| Method | Path          | Operation                           |
| ------ | ------------- | ----------------------------------- |
| GET    | /health       | API health check                    |
| GET    | /ride         | Get all rides without bids          |
| POST   | /ride         | Request a ride                      |
| GET    | /ride/:id     | Get a specific ride by id with bids |
| POST   | /ride/:id/bid | Make bid on ride                    |

## Not included

This API does not contain any authentication or authorization.
Authentication could be handled by a middleware.
Authorization should be handled by the different services in the application.

The fleets collection is not used in the application. It should be used to verify that a bid is made by an existing fleet.

## Examples

Create a new guest

Get all rides:

```console
$ curl --location 'localhost:3000/ride''
```

Create a new ride:

```console
$ curl --location 'localhost:3000/ride' \
--header 'Content-Type: application/json' \
--data '{
    "clientId": "c10000000000000000000000",
    "pickupLocation": "Away",
    "dropoffLocation": "Home",
    "proposedPrice": 1000
}'
```

Get a specific ride:

```console
$ curl --location 'localhost:3000/ride/65c3bfdbb89ea9dae2293c3c'
```

Make a bid on a ride:

```console
$ curl --location 'localhost:3000/ride/:id/bid' \
--header 'Content-Type: application/json' \
--data '{
	"fleetId": "1234",
    "bidAmount": 1400
}'
```
