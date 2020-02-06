import * as fs from 'fs'

const calculate = () => {
  const results1 = JSON.parse(fs.readFileSync('results-twoinstances-execcount-1.json').toString()).jobExecutionCounter
  const results2 = JSON.parse(fs.readFileSync('results-twoinstances-execcount-2.json').toString()).jobExecutionCounter
  const finalResult = {}
  Object.keys(results1).sort().forEach((r) => {
    finalResult[r] = results1[r] + results2[r]
  })
  fs.writeFileSync(`results-twoinstances-final.json`, JSON.stringify(finalResult, null, 1))

  const results1Time = JSON.parse(fs.readFileSync('results-twoinstances-exectimes-1.json').toString())
  const results2Time = JSON.parse(fs.readFileSync('results-twoinstances-exectimes-2.json').toString())

  const resultOverlaps = {}
  Object.entries(results1Time).forEach(([key, jobTry]) => {
    const secondResult = results2Time[key]
    // console.log('Times', times)
    const overlapsInSameAgenda1 = Object.values(jobTry).some(([ start, end ], index) => {
      return index < Object.values(jobTry).length && end > jobTry[index + 1]
    })
    const overlapsInAgenda2 = Object.entries(jobTry).some(([ job, [start1, end1]]) => {
      return (secondResult[job]as any).some(([start2, end2]) => {
        return (start1 < end2 && start1 > start2) || (end1 < end2 && end1 > start2)
      })
    })
    resultOverlaps[key] = overlapsInSameAgenda1 || overlapsInAgenda2
  })
  fs.writeFileSync(`results-twoinstances-overlap.json`, JSON.stringify(resultOverlaps, null, 1))
}

calculate()
