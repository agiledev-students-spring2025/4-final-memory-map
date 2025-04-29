To run this project

- cd backend
- npm install
- npm run dev

You can find the .env info on discord

Then run the front end

- cd front end
- npm install
- npm run start

For testing

- cd back-end
- npm install jsonwebtoken mongoose supertest express mongodb-memory-server cloudinary
- JWT_SECRET=testsecret npx mocha "test/**/*.test.js"