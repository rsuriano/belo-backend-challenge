
# belo backend challenge
Servicio que ejecuta swaps optimos via Binance de los siguientes pares:
> ETHUSDT

> BTCUSDT

> AAVEUSDC

## Deploy local
Para correr en local:
 1. crear archivo `.env` en la carpeta principal, usar`.env_dev` como plantilla (importante:`RUN_MODE=LOCAL`)
 2. correr los siguientes comandos:

```shell
npm install
npm run tsc
npm run start
```


## Deploy con Docker
Para correr con docker:
 1. crear archivo `.env` en la carpeta principal, copiar `.env_dev` tal como esta, reemplazar las keys de Binance faltantes
 2. correr los siguientes comandos:
 
```shell
docker-compose up
```

Los endpoints de la API se encuentran en la carpeta [requests](requests), para correr con la extension REST Client.

##  Tests
Para correr los tests, correr el siguiente comando, ya sea en local o dentro de la terminal del contenedor:
```shell
npm run test
```



## Endpoints

La API cuenta con tres endpoints, `/api/pairs`, `/api/quote`, y `/api/leads`: 

---

#### `GET` `/pairs`
*Obtiene la lista de pares disponibles para swappear.*

---

#### `POST` `/quote`
*Crea una estimacion (quote) dados un par, volumen y operacion (BUY o SELL).*

---

#### `POST` `/swap`
*Ejecuta el swap en base a una quote generada anteriormente. La quote tiene una expiracion dada por la variable `EXPIRATION_TIME` del `.env`.*

