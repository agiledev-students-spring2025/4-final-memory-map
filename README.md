# Memory Map Project

## GitHub Actions Status

[![Test](https://img.shields.io/github/actions/workflow/status/agiledev-students-spring2025/4-final-memory-map/deploy.yml?branch=master&label=Test&job=test)](https://github.com/agiledev-students-spring2025/4-final-memory-map/actions/workflows/deploy.yml)

[![Deploy](https://img.shields.io/github/actions/workflow/status/agiledev-students-spring2025/4-final-memory-map/deploy.yml?branch=master&label=Deploy&job=deploy)](https://github.com/agiledev-students-spring2025/4-final-memory-map/actions/workflows/deploy.yml)


## Project Website
[memorymap.club](memorymap.club)

## Extra Credit

- Deployed to Docker Container on Digital Ocean in ```docker-compose.yml```
- CI and CD both set up via Github Action inside ```.github/workflows/deploy.yml```

## Project Description

Create a web application that allows users to map their favorite memories by pinning locations with images, caption. Users can follow their friends to see their favorite memory locations.

## Project Vision Statement

Memory Map is an interactive location-based journaling app that allows users to pin personal memories to specific places on an digital map. By attaching meaningful messages, photos, and moments, users can create a visual timeline of their experiences, making it easier to relive and share cherished memories. With time, memories may fade, but Memory Map helps users feel like they’re stepping back into those moments—whether it's revisiting a place where they crocheted with their grandma, a small yet profound moment like a petal falling on their head, or reliving special times spent with friends.

## Team Members

Emily Yang - [xSeaGato](https://github.com/xSeaGato)<br/>
Brad Huang - [kaiserarg](https://github.com/kaiserarg)<br/>
Sophia Domonoske - [swdomo](https://github.com/swdomo)<br/>
Abby Ibarra - [abbyibarra](https://github.com/abbyibarra)<br/>
Yinqi Wang - [Yinqi596](https://github.com/Yinqi596)<br/>

## History

As a team, we have collaborated to create a wireframe to give a general idea of how our project will be for users.

## Instructions for Building and Testing

To work on this project, please follow our [contributing guidelines](./instructions-4-deployment.md).<br/>

Make a copy of the .envCOPY file and name it .env then copy the .env data from discord for the backend
Make a copy of .env.production.local.copy and name it .env.production.local in the frontend to make it work locally
For production use .env.production.local.copy with the correct server IP, and use docker compose up

#### Everything is ran on Ubuntu, please either use WSL or Ubuntu to run this

Run these commands to build the frontend

``` 
cd front-end
npm install
npm run start
```

Run these commands to build the backend

````
cd back-end
npm install
npm start watch
````

Run these commands to test the backend

````
cd back-end
JWT_SECRET=testsecret 
npx mocha test/**/*.test.js
````

Run these commands to spin up docker containers for the backend and front end
Install and open Docker Desktop then run
````
docker compose up
````
Or on command prompt either on Ubuntu or WSL
````
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl start docker
docker compose up
````

## Other Links, Sprints, and Due Dates

Several sets of instructions are included in this repository. They should each be treated as separate assignments with their own due dates and sets of requirements.

1. See the [App Map & Wireframes](instructions-0a-app-map-wireframes.md) and [Prototyping](./instructions-0b-prototyping.md) instructions for the requirements of the initial user experience design of the app.

1. Delete the contents of this file and replace with the contents of a proper README.md, as described in the [project setup instructions](./instructions-0c-project-setup.md)

1. See the [Sprint Planning instructions](instructions-0d-sprint-planning.md) for the requirements of Sprint Planning for each Sprint.

1. See the [Front-End Development instructions](./instructions-1-front-end.md) for the requirements of the initial Front-End Development.

1. See the [Back-End Development instructions](./instructions-2-back-end.md) for the requirements of the initial Back-End Development.

1. See the [Database Integration instructions](./instructions-3-database.md) for the requirements of integrating a database into the back-end.

1. See the [Deployment instructions](./instructions-4-deployment.md) for the requirements of deploying an app.
