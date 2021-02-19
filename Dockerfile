# use node 14 - alpine because it is the recomended image for slim size
FROM node:14-alpine as builder

# make a dir to include out app from
RUN mkdir -p /app
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

# compile the server to output
RUN npm run build


# MULTI STAGE - NOW, we do the real prod container
FROM node:14-alpine

# make a dir to include out app from
RUN mkdir -p /app
# set that dir as our working directory
WORKDIR /usr/src/app

COPY package*.json ./

# run install
# fail if lock is out of dock
# only install prod deps not devDeps, since we are compiled in this stage
RUN npm ci --production

COPY --from=builder /usr/src/app/dist/ ./

CMD ["npm", "start"]
