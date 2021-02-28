# use node 14 - alpine because it is the recomended image for slim size
FROM node:14-alpine as base

# make a dir to include out app from
RUN mkdir -p /usr/src/app
# set that dir as our working directory
WORKDIR /usr/src/app

# copy just the package and the lock, first
# this is better for caching the install step in docker
COPY package*.json ./

# run install
# fail if lock is out of dock
RUN npm ci

# copy the rest of the repo in
COPY . .


# STAGE: dev
FROM node:14-alpine as dev
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ ./
# compile the server to output
CMD ["npm", "run", "dev"]


# STAGE: builder
FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ ./
# compile the server to output
RUN npm run build


# STAGE: prod
FROM node:14-alpine as prod
WORKDIR /usr/src/app

# run smaller install of just necessary node_modules
COPY package*.json ./
# run install
# fail if lock is out of dock
# only install prod deps not devDeps, since we are compiled in this stage
RUN npm ci --production
# copy over only dist to make sure prod container is as small as possible
COPY --from=builder /usr/src/app/dist/ ./dist/

CMD ["npm", "start"]
