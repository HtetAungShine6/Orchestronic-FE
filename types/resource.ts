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
  engine: string
  storageGB: number
  resourceConfigId: string
}

export interface StorageInstance {
  id: string
  type: string
  capacityGB: number
  resourceConfigId: string
}

export interface ResourceConfig {
  id: string
  vms: VMInstance[]
  dbs: DatabaseInstance[]
  sts: StorageInstance[]
}
