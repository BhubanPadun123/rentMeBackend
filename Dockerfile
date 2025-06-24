# Use official Node.js 20 LTS base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port Azure expects
EXPOSE 8080

# Start the app
CMD ["node", "dist/index.js"]
