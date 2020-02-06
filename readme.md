## POCs for Agenda Locking

This repo contains two POCs for the [Agenda](https://github.com/agenda/agenda) locking mechanism.

### General Setup
install dependencies either `yarn install` or `npm install`.

Docker-compose should be available

### POC 1 - Single Instance
The first poc validates one instance running. The results in `results-singleinstance-execcount.json` show that all jobs ran essentially the same number of times and with no overlaps.

To run this poc: `npm agenda` with docker-compose up

### POC 2 - Two instances
The second poc validates that even with two instances, both of them execute the jobs about the same amount of times (fairly distributed load). Results for each instance are at `results-twoinstances-exectimes-{instance}.json` and `results-twoinstances-execcount-{instance}.json`. The compiled results are in `results-twoinstances-final.json` and `results-twoinstances-overlap.json`.

To reproduce run in two separate terminal shells:
`npm agenda2 -- 1` and `npm agenda2 -- 2` with docker-compose up. After finishing the agendas compile the result with `npm calculate`
