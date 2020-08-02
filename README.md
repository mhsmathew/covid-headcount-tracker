# Party Counter

This is a fairly simple yet useful tool to keep track of the headcount of any given event. As a result of COVID-19, many venues like bars, concerts, and even house-parties will have to open at a limited capacity making sure they strictly keep track of the number of attendees. This web app allows several events to be tracked at any given time with multiple people counting. 

[Live app here](http://partycount.ml)

## Example
A bar owner wants to track and keep statistics of each of his several bars. Each bar has one manager and several doormen. For each bar, the manager can create a new counter, share the name with all the doormen, and keep track of the headcount of each venue. Not only will the counts stay synched across all phones/computers, but at the end of the night, the owner will receive detailed statistics of how that venue did.

### TL; DR Steps

 1. Create counter
 2. Share counter name
 3. Keep count on the app
 4. Get statistics via email

## How It Works

This web application is made with Express and NodeJS. The back-end is several APIs and routes keeping track of all the data being handled. Once a call is made from the web app, the back-end will update a MongoDB database with all the counters and specific counts. Then the front-end uses the data received to populate a CanvasJS graph and show the current headcount. However, making sure each device is synched, I used Pusher (which is pretty much a series of web sockets) to keep the realtime data flowing. For each different counter, we can create different Pusher channels.

### Technologies/Frameworks

 - Express and NodeJS
 - MongoDB
 - Pusher
 - Javascript, JQuery, HTML, and CSS
 - Several different npm packages

## How to Use

Just create a new MongoDB database and Pusher account. Fill in the .env file with your variables and run server.js.

## More?

[Check out some of my other projects on my website](https://mathewsteininger.com)

[Party Count App](http://partycount.ml)
