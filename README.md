# Actor degrees of seperation

## Overview of application

This application allows you to enter 2 actors and see (in terms of movies) how many degrees of seperation they are from each other. For example, if an actor is in a movie with another actor, they are 1 movie seperated, or 1 degree of seperation.  If an actorA is not in a movie with actorB, but they are both in a movie with actorC, then they are 2 degrees of seperation away from each other.

The maximum this application can generate is 3 degrees of seperation. Also, Actors born before ~1960 are filtered out.  Finally, actors and movies must be a certain level of popularity to exist in the data.

## Technical architecture of application

This application is a basic example of a next JS frontend, which uses tanstack react query to call a next JS defined middleware.  The middleware uses NextResponse to rewrite requests and authenticate against Foundry using a service user. Foundry requests are created using a Foundry generated OSDK.

The Foundry backend can be divided into 4 parts, data generation, data storage, actor linkage calculation, and data querying.

- Data generation occurs in a transform which calls a function in a docker image to scrape IMDB / wikipedia.
- Data is stored in the Foundry ontology via 2 object types, Movies and Actors.
- The link actors query is a Typescript function that uses a many to many relationship between actor and movies to calculate minimum distance.
- Finally, all data querying is facilitated by a generated OSDK, which has a restricted scope to Actor, Movie, and linkActors. All authentication goes through the generated Foundry service user.

