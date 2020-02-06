import * as fs from 'fs'
import * as Agenda from 'agenda'

const jobCompletionTimeMillis = 5_000
const agendaCron = '1 seconds'
const maxConcurrency = 5
const jobCount = 30
const agendaInstance = process.argv[2]
const startTime = Date.now()

const agenda = new Agenda({
  maxConcurrency,
  db: {
    address: 'mongodb://localhost:27017/agenda'
  }
})

const jobExecutionCounter = {}
const jobExecutionTimestamps = {}

const jobs = []
for (let i = 0; i < jobCount; i++) {
  jobs.push(`job-${i+1}`)
}

jobs.forEach((job) => {
  agenda.define(job, async () => {
    console.log(`Agenda ${agendaInstance} got ${job}`)
    jobExecutionTimestamps[job] = {
      ...(jobExecutionTimestamps[job] || {}),
      [(jobExecutionCounter[job] || 0)]: [Date.now()]
    }

    await new Promise((res) => setTimeout(res, jobCompletionTimeMillis))

    jobExecutionTimestamps[job][(jobExecutionCounter[job] || 0)].push(Date.now())
    jobExecutionCounter[job] = (jobExecutionCounter[job] || 0) + 1
    console.log(`Agenda ${agendaInstance} finished ${job}`)
  })
})

const init = async () => {
  await agenda.start()
  jobs.forEach((job) => {
    agenda.every(agendaCron, job)
  })
}

init()

const exitHandler = async () => {
  console.log(`Writing results`)
  await agenda.stop()
  fs.writeFileSync(`results-twoinstances-execcount-${agendaInstance}.json`, JSON.stringify({
    jobExecutionCounter,
    duration: `${(Date.now() - startTime)/1000} seconds`,
  }, null, 1))
  fs.writeFileSync(`results-twoinstances-exectimes-${agendaInstance}.json`, JSON.stringify(jobExecutionTimestamps, null, 1))
  process.exit(0)
}

process.on('SIGTERM', exitHandler)
process.on('SIGINT', exitHandler)
