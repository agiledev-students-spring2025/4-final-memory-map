#!/usr/bin/env node

import server from './app.js';
const port = 4000 // incoming requests port

// call express listen function
const listener = server.listen(port, function () {
  console.log(`Server running on port: ${port}`)
});

// listener port function
const close = () => {
  listener.close()
};

export { close };