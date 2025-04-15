import server from './app.js';
import connectDB from './config/db.js';
const port = 4000

connectDB();

const listener = server.listen(port, function () {
  console.log(`Server running on port: ${port}`)
});

const close = () => {
  listener.close()
};

export { close };