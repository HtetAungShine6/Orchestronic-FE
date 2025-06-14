import fs from "fs"
import path from "path"
import { faker } from "@faker-js/faker"

import { labels, priorities, statuses } from "./data"
import { generateRepoName, generateResources } from "@/lib/utils"

const requests = Array.from({ length: 100 }, () => ({
  // id: `R-${faker.number.int({ min: 1000, max: 9999 })}`,
  description: faker.hacker
    .phrase()
    .replace(/^./, (letter) => letter.toUpperCase()),
  // status: faker.helpers.arrayElement(statuses).value,
  // date: faker.date.anytime(),
    developers: Array.from(
      { length: faker.number.int({ min: 3, max: 5 }) },
      () => faker.person.fullName()
    ),
  repository: generateRepoName(),
  // label: faker.helpers.arrayElement(labels).value,
  // priority: faker.helpers.arrayElement(priorities).value,
}))

fs.writeFileSync(
  path.join(__dirname, "requests.json"),
  JSON.stringify(requests, null, 2)
)

console.log("✅ Requests data generated.")
