import { Resource } from "@/app/(dashboard)/resources/data/schema-resources"
import { Role } from "@/types/role"
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

const resourceTypes = {
  vms: "VM",
  dbs: "DB",
  sts: "ST",
}
export function generateResources(resourceConfig: Resource["resourceConfig"]) {
  return Object.entries(resourceConfig)
    .filter(([key, value]) => key !== "id" && Array.isArray(value))
    .map(([type, items]) => {
      const count = items.length
      const label =
        count > 1
          ? `${resourceTypes[type as keyof typeof resourceTypes]}s`
          : resourceTypes[type as keyof typeof resourceTypes]
      return `${count} ${label}`
    })
    .join(", ")
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

export function formatResourceCounts(resource: Record<string, number>): string {
  // Remove id key
  const { ...counts } = resource

  return Object.entries(counts)
    .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
    .join(", ")
}

export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  )
}

export function haveAdminOrIT(role?: Role): boolean {
  return role === Role.Admin || role === Role.IT
}

export function formatMB(mb: number): string {
  if (mb >= 1024 * 1024) return (mb / (1024 * 1024)).toFixed(2) + " TB"
  if (mb >= 1024) return (mb / 1024).toFixed(2) + " GB"
  return mb + " MB"
}
