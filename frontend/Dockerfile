# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (if available)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN ls
RUN pnpm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["pnpm", "run", "dev"]