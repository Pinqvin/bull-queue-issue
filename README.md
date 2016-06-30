# Bull Queue issue

This is a repository which contains example code that demonstrates an issue
with a bull queue worker processing the same job multiple times.

The server process ads a single job to the Bull queue and the worker starts to
process the job.

## Environment variables

The example application is configured with environment variables:

* `REDIS_HOST` - Hostname for the redis instance
* `REDIS_PORT` - Port for the redis instance
* `REDIS_URL` - A connection URI to a redis instance. Can be used instead of the port/host
* `JOB_SIZE` - Number of UUIDs to generate for the jobid
* `WORKER_CHUNK_SIZE` - Size of a chunk being worked on at a time

For the dockerized environment these values can be provided and changed in the `.env`
file.

## Running the example code

A Dockerized environment is provided for running the example code. An LTS version
of Node is used by the Docker containers.

### Running with a local Redis instance

This repository contains a Dockerfile to build the server and worker processes.
To start the local Redis instance, use the command

```
docker-compose up -d redis
```

After redis has been started you can start the worker and server processes in separate
terminals with the following commands

```
docker-compose up worker
```

```
docker-compose up server
```

You can change the details of the redis server port and hostname by changing the `REDIS_HOST`
and `REDIS_PORT` values in the `.env` file. After you've changed these values you also need
to restart the worker and server processes.

### Running with a remote redis instance

If you want to use a connection URI to connect to your remote (or local) redis instance, you
need to remove the `REDIS_HOST` and `REDIS_PORT` values from the `.env` file. After removing
the values, you need to add a `REDIS_URL` value with the connection URI. The URI should be
of the following format:

```
redis://<username:password>@host:port
```
