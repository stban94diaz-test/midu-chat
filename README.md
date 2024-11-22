# Chat in real time

Copy of [midulive: Chat en TIEMPO REAL con Node.js, Socket.io, SQL, HTML y CSS](https://www.youtube.com/watch?v=WpbBhTx5R9Q&ab_channel=midulive)

## Commands

```bash
npm install
npm run dev
```

## Technologies

### Express

This project use express how a backend framework

### Socket.io

This project use Socket.io how a websocket backend and front, this library allows the communication and can be send the messages

### Turso

This project use Turso for create a database, this use sqlite database

#### Turso commands

* Install Turso `brew install tursodatabase/tap/turso`
* Auth into Turso `turso auth signup`
* Create a new database `turso db create`
* Show details of the database `turso db show verified-nextwave`
* Create a token for the database `turso db tokens create verified-nextwave`

## Environments

```bash
DB_URL=libsql://YOUR-URL-TURSO.turso.io
DB_TOKEN=YOUR-TOCKET-DB-TURSO
```
