# Step 1 - build and transpile the app
FROM node:20-alpine as tsbuilder

WORKDIR /home/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY .env.defaults .
COPY src /home/app/src

RUN npm ci

RUN npm run build

# Step 2 - wash out dependencies not needed in prd
FROM node:20-alpine as builder
ENV NODE_ENV=production
WORKDIR /home/app

# Copy the package files
COPY --from=tsbuilder /home/app/package.json /home/app/
COPY --from=tsbuilder /home/app/package-lock.json /home/app/

# Copy the transpiled files
COPY --chown=1000:1000 --from=tsbuilder /home/app/dist /home/app/dist/

# Copy env stuff
COPY --from=tsbuilder /home/app/.env.defaults /home/app/.env.defaults

RUN npm ci --omit:dev

USER 1000:1000

EXPOSE 3000

CMD ["node", "dist/index.js"]
