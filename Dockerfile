# 1. Start with the official Node.js image as a base
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install the application dependencies
RUN npm install

# 5. Copy the rest of your application code
COPY . .

# 6. Expose the port the app runs on
EXPOSE 3000

# 7. Define the command to run your app
CMD [ "npm", "start" ]