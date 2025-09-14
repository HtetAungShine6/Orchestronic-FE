import { VmSizeDto } from "./request"

export interface VMInstance {
  id: string
  name: string
  os: string
  size: VmSizeDto
  sizeId: string
  resourceConfigId: string
  terraformState?: {
    resources: Array<{
      name: string
      instances: Array<{ attributes: { public_ip_address: string } }>
    }>
  }
  pem?: string
}

export interface AwsVMInstance {
  id: string
  instanceName: string
  os: string
  keyName: string
  sgName: string
  AwsInstanceType: AwsInstanceType
}

interface AwsInstanceType {
  id: string
  name: string
  numberOfCores: number
  memoryInMB: number
  raw: JSON
  AwsVMInstance: AwsVMInstance[]
}

interface AwsDatabaseType {
  id: string
  DBInstanceClass: string
  engine: Engine
  raw: JSON
  MinStorageSize: number
  MaxStorageSize: number
  AwsDatabaseInstance: AwsDatabaseInstance[]
}

export interface AwsDatabaseInstance {
  id: string
  dbUsername: string
  dbPassword: string
  dbInstanceClass: AwsDatabaseType
  engine: Engine
  dbAllocatedStorage: number
  dbName: string
  resourceConfigId: string
}

export interface AwsStorageInstance {
  id: string
  bucketName: string
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
  terraformState?: {
    resources: Array<{
      name: string
      mode: string
      instances: Array<{
        attributes: { public_ip_address: string; fqdn: string }
      }>
    }>
  }
}

export interface StorageInstance {
  id: string
  name: string
  kind: string
  sku: string
  accessTier: string
  terraformState?: {
    resources: Array<{
      name: string
      mode: string
      instances: Array<{
        attributes: { primary_blob_connection_string: string }
      }>
    }>
  }
  resourceConfigId: string
}

export interface ResourceAzureConfig {
  id: string
  AzureVMInstance: VMInstance[]
  AzureDatabase: DatabaseInstance[]
  AzureStorage: StorageInstance[]
}

export interface ResourceAwsConfig {
  id: string
  AwsVMInstance: AwsVMInstance[]
  AwsDatabase: AwsDatabaseInstance[]
  AwsStorage: AwsStorageInstance[]
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
    // {
    //   value: "eastus",
    //   label: "US East (Virginia)",
    //   flag: "https://flagsapi.com/US/flat/16.png",
    // },
  ],
  [CloudProvider.AWS]: [
    {
      value: "ap-southeast-1",
      label: "Asia Pacific (Singapore)",
      flag: "https://flagsapi.com/SG/flat/16.png",
    },
    // {
    //   value: "us-east-1",
    //   label: "US East (N. Virginia)",
    //   flag: "https://flagsapi.com/US/flat/16.png",
    // },
  ],
}
