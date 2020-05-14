# scrape-zone

Copy `.env.example` file as `.env` file and copy the following

```
PORT=3000
DATABASE_URL=mongodb://ScrapeZoneMongoDB/ScrapeZone
```

Then run on the cli;

```
docker-compose up -d
```

It will create server and database containers. After process you can visit http:localhost:3000/search?keywords=search+example as sample query.

You can manually run application without docker too. You should change DATABASE_URL to an existing,valid url and run;

```
node src/index.js
```
