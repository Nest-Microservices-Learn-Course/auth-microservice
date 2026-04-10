FROM node:25-alpine3.22

WORKDIR /usr/src/app
COPY package*.json ./

# RUN npm install -g pnpm
# RUN pnpm install
RUN yarn install

COPY . .

# RUN yarn prisma generate

EXPOSE 3004

# CMD ["pnpm", "start:dev"]