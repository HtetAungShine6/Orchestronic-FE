import { VmSizeDto } from "./request"

export interface VMInstance {
  id: string
  name: string
  os: string
  size: VmSizeDto
  sizeId: string
  resourceConfigId: string
}

export interface DatabaseInstance {
  id: string
  engine: Engine
  storageGB: number
  resourceConfigId: string
  name: string
  password: string
  skuName: string
  username: string
}

export interface StorageInstance {
  id: string
  name: string
  kind: string
  sku: string
  accessTier: string
  resourceConfigId: string
}

export interface ResourceConfig {
  id: string
  vms: VMInstance[]
  dbs: DatabaseInstance[]
  sts: StorageInstance[]
}

export enum Engine {
  MySQL = "MySQL",
  PostgreSQL = "PostgreSQL",
}

export enum CloudProvider {
  AWS = "AWS",
  AZURE = "AZURE",
}

export const cloudProviders = [
  { value: CloudProvider.AZURE, label: "Azure", icon: "/icon/azure.svg" },
  { value: CloudProvider.AWS, label: "AWS", icon: "/icon/aws.svg" },
]

export const regions = {
  [CloudProvider.AZURE]: [
    {
      value: "southeastasia",
      label: "Asia Pacific (Singapore)",
      flag: "https://flagsapi.com/SG/flat/16.png",
    },
    {
      value: "eastus",
      label: "US East (Virginia)",
      flag: "https://flagsapi.com/US/flat/16.png",
    },
  ],
  [CloudProvider.AWS]: [
    {
      value: "ap-southeast-1",
      label: "Asia Pacific (Singapore)",
      flag: "https://flagsapi.com/SG/flat/16.png",
    },
    {
      value: "us-east-1",
      label: "US East (N. Virginia)",
      flag: "https://flagsapi.com/US/flat/16.png",
    },
  ],
}
