## walletconnect-pay-backend

## Requirements

- NODE version 8.x.x (download LTS version (here)[https://nodejs.org])
- NPM version 5.x.x (included with NODE)
- PostgreSQL version 9.5.10 (available with Homebrew)

## Setting Up Database (development)

On MacOS, it's easier to install (Postgres.app)[http://postgresapp.com/] version 2.x.x

Create a new database for walletconnect-pay

```bash
  $ psql -c 'CREATE DATABASE "walletconnect-pay"'
```

Finally, start the database server on Postgres.app

## Setting Up Project

Clone repository

```bash
  $ git clone https://github.com/walletconnect-pay/walletconnect-pay.git
```

Change directory to repository's folder

```bash
  $ cd walletconnect-pay
```

Install Dependencies

```bash
  $ npm install
```

Initiate project

```bash
  $ npm run dev
```
