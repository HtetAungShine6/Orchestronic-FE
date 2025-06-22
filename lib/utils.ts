import { faker } from "@faker-js/faker"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}

const resourceTypes = ["VM", "DB", "ST"]
export function generateResources() {
  const counts: Record<string, number> = {}

  const types = faker.helpers
    .shuffle(resourceTypes)
    .slice(0, faker.number.int({ min: 1, max: 3 }))

  for (const type of types) {
    counts[type] = faker.number.int({ min: 1, max: 3 })
  }

  const formatted = Object.entries(counts)
    .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
    .join(", ")

  return formatted
}

export function generateRepoName() {
  const adjective = faker.word.adjective() // e.g., "fast"
  const noun = faker.word.noun() // e.g., "engine"
  return `${adjective}-${noun}`.toLowerCase() // e.g., "fast-engine"
}

export function getRepoPrefix(repoName: string): string {
  const firstPart = repoName.split("-")[0]
  return firstPart.slice(0, 2)
}

export function validateFormat(name: string) {
  return /^[a-z]+(-[a-z]+)*$/.test(name)
}

export function formatRepoName(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric sequences with hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

export function checkBlank(name: string) {
  return name.trim() === ""
}

export function formatResourceCounts(resource: Record<string, any>): string {
  // Remove id key
  const { id, ...counts } = resource

  return Object.entries(counts)
    .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
    .join(", ")
}
