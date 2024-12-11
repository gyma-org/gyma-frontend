# Step 1: Build the Next.js app
FROM node:20-alpine AS build

COPY . /app
WORKDIR /app

# Install dependencies and build the app
COPY package.json package-lock.json ./
RUN npm install
RUN npm run build

# Step 2: Production environment
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app /app

# Expose the port used by Next.js
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]
