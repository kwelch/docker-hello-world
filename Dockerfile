# use node 14 - alpine because it is the recomended image for slim size
FROM node:14-alpine

# make a dir to include out app from
RUN mkdir -p /usr/src/app
# set that dir as our working directory
WORKDIR /usr/src/app

# copy just the package and the lock, first
# this is better for caching the install step in docker
COPY package.json yarn.lock ./

# run install
# fail if lock is out of dock
# only install prod deps not devDeps
RUN yarn install --frozen-lockfile --production

# copy the rest of the repo in
COPY . .

# allow external access to our interal port
# I don't like that this is hard coded and could get out of sync with the definition else where :sad:
EXPOSE 3000

# command to run at container start
CMD ["yarn", "start"]

