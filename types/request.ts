export interface VmSizeDto {
  id: string

  name: string

  numberOfCores: number

  maxDataDiskCount: number

  memoryInMB: number

  osDiskSizeInMB: number

  resourceDiskSizeInMB: number
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
