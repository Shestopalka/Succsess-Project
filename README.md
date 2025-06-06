<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
<a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

# Success Project

Це серверна частина проєкту, побудована на [NestJS](https://nestjs.com/) — прогресивному фреймворку для створення ефективних та масштабованих Node.js додатків.

## Технології

- **NestJS** — основа серверного застосунку  
- **TypeScript** — мова програмування  
- **Docker** та **docker-compose** — для контейнеризації  
- **ESLint** — аналіз коду  
- **Prettier** — форматування коду  
- **Jest** — для тестування

## Передумови

Перед запуском переконайтесь, що у вас встановлено:

- **Node.js (рекомендовано версію 18+)**  
  ➤ [Встановити Node.js](https://nodejs.org/)

- **Docker**  
  ➤ [Встановити Docker Desktop (Windows/Mac)](https://www.docker.com/products/docker-desktop)  
  ➤ [Інструкція для Linux (Ubuntu)](https://docs.docker.com/engine/install/ubuntu/)

- **Docker Compose**  
  ➤ Docker Compose входить до складу Docker Desktop.  
  ➤ Для Linux: [Встановити окремо](https://docs.docker.com/compose/install/)

- **Git**  
  ➤ [Встановити Git](https://git-scm.com/downloads)

## .evn
Створення файлу .env
Створи файл .env у корені проєкту та додай наступні змінні середовища:
```bach
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=99445753
DB_NAME=database

# AWS S3
AWS_ACCESS_KEY_ID= you access-key
AWS_SECRET_ACCESS_KEY=you secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=succsess-s3
```
## 4. Запуск бази даних за допомогою Docker
Переконайтеся, що у тебе встановлені Docker та Docker Compose.

Створіть docker-compuse.yml та додайте в нього:
```bash
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: succsess-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 99445753
      POSTGRES_DB: database
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongo:
    image: mongo:6
    container_name: succsess-mongo
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    volumes:
      - mongo_data:/data/db

volumes:
  postgres_data:
  mongo_data:
```

Запусти базу даних PostgreSQL та MongoDB:
```bash
docker-compose up -d
```
Можна перевірити з'єднання за допомогою MongoDB Compass або клієнта в терміналі:
```bash
mongo mongodb://root:example@localhost:27017
```
## Інтеграція з AWS S3
Додаток використовує AWS S3 для зберігання файлів. Для цього необхідно:

Створити бакет у AWS S3 з назвою, вказаною у AWS_S3_BUCKET_NAME.

Налаштувати облікові дані AWS у файлі .env.

Використовувати відповідні сервіси або контролери у додатку для завантаження та отримання файлів з S3.


## Встановлення та запуск
```bash
$ npm install
```
### 1. Клонування репозиторію

```bash
git clone https://github.com/Shestopalka/Succsess-Project.git
cd Succsess-Project
```

## Description
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Компіляція та запуск проекту

```bash
# development
$ npm run start

#run with use Docker
$ docker-compose up --build

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Запуск тестів
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

