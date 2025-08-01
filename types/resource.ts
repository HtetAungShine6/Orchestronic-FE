export interface VMInstance {
  id: string
  name: string
  numberOfCores: number
  memory: number
  os: string
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
