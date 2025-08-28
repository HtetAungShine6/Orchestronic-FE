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

export interface AzureRetailPriceItem {
  currencyCode: string
  tierMinimumUnits: number
  retailPrice: number
  unitPrice: number
  armRegionName: string
  location: string
  effectiveStartDate: string
  meterId: string
  meterName: string
  productId: string
  skuId: string
  productName: string
  skuName: string
  serviceName: string
  serviceId: string
  serviceFamily: string
  unitOfMeasure: string
  type: string
  isPrimaryMeterRegion: boolean
  armSkuName: string
}

export interface AzureRetailPriceResponse {
  BillingCurrency: string
  CustomerEntityId: string
  CustomerEntityType: string
  Items: AzureRetailPriceItem[]
  NextPageLink: string | null
  Count: number
}
