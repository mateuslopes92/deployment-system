FROM node:21.6.2-alpine

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]