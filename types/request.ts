export interface VmSizeDto {
  id: string
  name: string
  numberOfCores: number
  maxDataDiskCount: number
  memoryInMB: number
  osDiskSizeInMB: number
  resourceDiskSizeInMB: number
}

export interface VMPolicyDto {
  name: string
  numberOfCores: number
  memoryInMB: number
  cloudProvider: "AZURE" | "AWS"
}

export interface DatabasePolicyDto {
  maxStorage: number
  cloudProvider: "AZURE" | "AWS"
}

export interface StoragePolicyDto {
  maxStorage: number
  cloudProvider: "AZURE" | "AWS"
}

export interface PaginationMetaDto {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedVmSizesDto {
  data: VmSizeDto[]
  meta: PaginationMetaDto
}
