# # # # # # # # #


# PHASE 1
# Install dependencies only when needed.

FROM node:18-alpine AS dependencies

RUN apk add --no-cache libc6-compat

WORKDIR /home/app/

COPY package.json ./
COPY package-lock.json ./

RUN npm ci


# # # # # # # # #


# PHASE 2
# Build the NextJS app.

FROM dependencies AS builder

WORKDIR /home/app/

COPY --from=dependencies /home/app/node_modules ./node_modules
COPY . .

ARG NODE_ENV
ENV NODE_ENV=”${NODE_ENV}”

RUN npm run build


# # # # # # # # #


# PHASE 3
# Setup the final Docker image with only the required files.

FROM builder AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /home/app/.next/standalone ./standalone
COPY --from=builder /home/app/public /home/app/standalone/public
COPY --from=builder /home/app/.next/static /home/app/standalone/.next/static

RUN mkdir -p /home/app/exports
RUN chown -R nextjs:nodejs /home/app/exports
RUN chmod -R 755 /home/app/exports

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD [“node”, “./standalone/server.js”]