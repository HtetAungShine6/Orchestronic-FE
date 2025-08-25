"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Cpu, Database, DatabaseZap, Pencil } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { haveAdminOrIT } from "@/lib/utils"
import Image from "next/image"
import { AzureVMSizeCombobox } from "@/components/requests/resource-group-accordion-vm"
import {
  DatabasePolicyDto,
  StoragePolicyDto,
  VMPolicyDto,
  VmSizeDto,
} from "@/types/request"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getPolicyDB,
  getPolicyST,
  getPolicyVM,
  updatePolicyDB,
  updatePolicyST,
  updatePolicyVM,
} from "@/app/api/policy/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import PolicySectionSkeleton from "./policy-section-skeleton"
import { getUser } from "@/app/api/user/api"

export default function PolicySection() {
  const [activeTab, setActiveTab] = useState<"AZURE" | "AWS">("AZURE")

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as "AZURE" | "AWS")}
    >
      <TabsList>
        <TabsTrigger value="AZURE">
          <Image
            src="/icon/azure.svg"
            alt="Azure Cloud Provider Icon"
            width={16}
            height={16}
          />
          <p>Azure</p>
        </TabsTrigger>
        <TabsTrigger value="AWS">
          <Image
            src="/icon/aws.svg"
            alt="AWS Cloud Provider Icon"
            width={16}
            height={16}
          />
          <p>AWS</p>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="AZURE" className="mt-6">
        <motion.div
          key="azure"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <PolicyCardAzure activeTab={activeTab} />
        </motion.div>
      </TabsContent>
      <TabsContent value="AWS" className="mt-6">
        <motion.div
          key="aws"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <PolicyCardAWS activeTab={activeTab} />
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}

function PolicyCardAzure({ activeTab }: { activeTab: "AZURE" | "AWS" }) {
  const {
    data: session,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  })

  const { data: dbData } = useQuery({
    queryKey: ["policies-db", activeTab],
    queryFn: () => getPolicyDB(activeTab),
  })

  const { data: stData } = useQuery({
    queryKey: ["policies-st", activeTab],
    queryFn: () => getPolicyST(activeTab),
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ["policies-vm", activeTab],
    queryFn: () => getPolicyVM(activeTab),
  })

  if (isLoadingUser) {
    return <div>Loading...</div>
  }

  if (errorUser) {
    return <div>Error fetching user data</div>
  }

  if (isLoading) return <PolicySectionSkeleton />
  if (error) return <div>Error loading policies</div>

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Cpu size={16} />
          <h3 className="font-medium">VM</h3>
        </div>
        {haveAdminOrIT(session?.role) && (
          <EditPolicyDialog data={data} activeTab={activeTab} kind="vm" />
        )}
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <p className="text-sm text-muted-foreground">Max:</p>
          <p className="mt-2">{data?.name}</p>
          <div className="text-muted-foreground text-sm">
            <p>{data?.numberOfCores} vCPUs</p>
            <p>{Math.round((data?.memoryInMB ?? 0) / 1024)} GB of RAM</p>
          </div>
        </div>
        <div className="grid gap-2 w-1/2">
          <p className="text-sm text-muted-foreground">Description</p>
          <p>
            Teams can request up to CPU cores per environment. Any requests
            beyond this threshold will be reviewed by the operations team and
            require justification.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Database size={16} />
          <h3 className="font-medium">Database</h3>
        </div>
        {haveAdminOrIT(session?.role) && (
          <EditPolicyDialog data={dbData} activeTab={activeTab} kind="db" />
        )}
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <p className="text-sm text-muted-foreground">Max:</p>
          <p className="mt-2">{dbData?.maxStorage} GB</p>
        </div>
        <div className="grid gap-2 w-1/2">
          <p className="text-sm text-muted-foreground">Description</p>
          <p>
            Teams can request up to CPU cores per environment. Any requests
            beyond this threshold will be reviewed by the operations team and
            require justification.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <DatabaseZap size={16} />
          <h3 className="font-medium">Storage</h3>
        </div>
        {haveAdminOrIT(session?.role) && (
          <EditPolicyDialog data={stData} activeTab={activeTab} kind="st" />
        )}
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <p className="text-sm text-muted-foreground">Max:</p>
          <p className="mt-2">{stData?.maxStorage} GB</p>
        </div>
        <div className="grid gap-2 w-1/2">
          <p className="text-sm text-muted-foreground">Description</p>
          <p>
            Teams can request up to CPU cores per environment. Any requests
            beyond this threshold will be reviewed by the operations team and
            require justification.
          </p>
        </div>
      </div>
    </div>
  )
}

function PolicyCardAWS({ activeTab }: { activeTab: "AZURE" | "AWS" }) {
  const { data: session } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  })

  const { data: dbData } = useQuery({
    queryKey: ["policies-db", activeTab],
    queryFn: () => getPolicyDB(activeTab),
  })

  const { data: stData } = useQuery({
    queryKey: ["policies-st", activeTab],
    queryFn: () => getPolicyST(activeTab),
  })

  const {
    data: vmData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["policies-vm", activeTab],
    queryFn: () => getPolicyVM(activeTab),
  })

  if (isLoading) return <PolicySectionSkeleton />
  if (error) return <div>Error loading policies</div>

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Cpu size={16} />
          <h3 className="font-medium">VM</h3>
        </div>
        {haveAdminOrIT(session?.role) && (
          <EditPolicyDialog data={vmData} activeTab={activeTab} kind="vm" />
        )}
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <p className="text-sm text-muted-foreground">Max:</p>
          <p className="mt-2">{vmData?.name}</p>
          <div className="text-muted-foreground text-sm">
            <p>{vmData?.numberOfCores} vCPUs</p>
            <p>{Math.round((vmData?.memoryInMB ?? 0) / 1024)} GB of RAM</p>
          </div>
        </div>
        <div className="grid gap-2 w-1/2">
          <p className="text-sm text-muted-foreground">Description</p>
          <p>
            Teams can request up to CPU cores per environment. Any requests
            beyond this threshold will be reviewed by the operations team and
            require justification.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Database size={16} />
          <h3 className="font-medium">Database</h3>
        </div>
        {haveAdminOrIT(session?.role) && (
          <EditPolicyDialog data={dbData} activeTab={activeTab} kind="db" />
        )}
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <p className="text-sm text-muted-foreground">Max:</p>
          <p className="mt-2">{dbData?.maxStorage} GB</p>
        </div>
        <div className="grid gap-2 w-1/2">
          <p className="text-sm text-muted-foreground">Description</p>
          <p>
            Teams can request up to CPU cores per environment. Any requests
            beyond this threshold will be reviewed by the operations team and
            require justification.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <DatabaseZap size={16} />
          <h3 className="font-medium">Storage</h3>
        </div>
        {haveAdminOrIT(session?.role) && (
          <EditPolicyDialog data={stData} activeTab={activeTab} kind="st" />
        )}
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <p className="text-sm text-muted-foreground">Max:</p>
          <p className="mt-2">{stData?.maxStorage} GB</p>
        </div>
        <div className="grid gap-2 w-1/2">
          <p className="text-sm text-muted-foreground">Description</p>
          <p>
            Teams can request up to CPU cores per environment. Any requests
            beyond this threshold will be reviewed by the operations team and
            require justification.
          </p>
        </div>
      </div>
    </div>
  )
}

function EditPolicyDialog({
  data,
  activeTab,
  kind,
}: {
  data?: VMPolicyDto | DatabasePolicyDto | StoragePolicyDto
  activeTab: "AZURE" | "AWS"
  kind: "vm" | "db" | "st"
}) {
  const [selectedVmSize, setSelectedVmSize] = useState<VmSizeDto | undefined>()
  const [dbValue, setDBValue] = useState<string>("")
  const [storageValue, setStorageValue] = useState<string>("")
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Type guard functions
  const isVMPolicy = useCallback(
    (policy: typeof data): policy is VMPolicyDto => {
      return policy != null && "name" in policy && kind === "vm"
    },
    [kind]
  )

  const isDbPolicy = useCallback(
    (policy: typeof data): policy is DatabasePolicyDto => {
      return policy != null && "maxStorage" in policy && kind === "db"
    },
    [kind]
  )

  const isStoragePolicy = useCallback(
    (policy: typeof data): policy is StoragePolicyDto => {
      return policy != null && "maxStorage" in policy && kind === "st"
    },
    [kind]
  )

  // Initialize form values when dialog opens
  useEffect(() => {
    if (open && data) {
      if (isVMPolicy(data)) {
        // Set the initial VM size selection based on current policy
        setSelectedVmSize({
          id: data.name, // Use name as ID since VMPolicyDto might not have id
          name: data.name,
          numberOfCores: data.numberOfCores,
          memoryInMB: data.memoryInMB,
          osDiskSizeInMB: 0, // These might not be available in policy data
          maxDataDiskCount: 0,
        } as VmSizeDto)
      } else if (isDbPolicy(data)) {
        setDBValue(data.maxStorage.toString())
      } else if (isStoragePolicy(data)) {
        setStorageValue((data as StoragePolicyDto).maxStorage.toString())
      }
    }
  }, [open, data, isVMPolicy, isDbPolicy, isStoragePolicy])

  const updateVMPolicyMutation = useMutation({
    mutationFn: (params: {
      name: string
      numberOfCores: number
      memoryInMB: number
      cloudProvider: string
    }) => updatePolicyVM(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies-vm"] })
      queryClient.invalidateQueries({ queryKey: ["policies-db"] })
      queryClient.invalidateQueries({ queryKey: ["policies-st"] })
      setOpen(false)
    },
    onError: (error) => {
      console.error("Failed to update VM policy:", error)
    },
  })

  const updateDBPolicyMutation = useMutation({
    mutationFn: (params: { maxStorage: number; cloudProvider: string }) =>
      updatePolicyDB(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies-vm"] })
      queryClient.invalidateQueries({ queryKey: ["policies-db"] })
      queryClient.invalidateQueries({ queryKey: ["policies-st"] })
      setOpen(false)
    },
    onError: (error) => {
      console.error("Failed to update DB policy:", error)
    },
  })

  const updateSTPolicyMutation = useMutation({
    mutationFn: (params: { maxStorage: number; cloudProvider: string }) =>
      updatePolicyST(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies-vm"] })
      queryClient.invalidateQueries({ queryKey: ["policies-db"] })
      queryClient.invalidateQueries({ queryKey: ["policies-st"] })
      setOpen(false)
    },
    onError: (error) => {
      console.error("Failed to update Storage policy:", error)
    },
  })

  const handleSave = () => {
    if (isVMPolicy(data) && selectedVmSize) {
      updateVMPolicyMutation.mutate({
        name: selectedVmSize.name,
        numberOfCores: selectedVmSize.numberOfCores,
        memoryInMB: selectedVmSize.memoryInMB,
        cloudProvider: activeTab,
      })
    } else if (isDbPolicy(data) && dbValue) {
      const maxStorage = parseInt(dbValue)
      if (!isNaN(maxStorage)) {
        updateDBPolicyMutation.mutate({
          maxStorage,
          cloudProvider: activeTab,
        })
      }
    } else if (isStoragePolicy(data) && storageValue) {
      const maxStorage = parseInt(storageValue)
      if (!isNaN(maxStorage)) {
        updateSTPolicyMutation.mutate({
          maxStorage,
          cloudProvider: activeTab,
        })
      }
    }
  }

  const isLoading =
    updateVMPolicyMutation.isPending ||
    updateDBPolicyMutation.isPending ||
    updateSTPolicyMutation.isPending

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit policy</DialogTitle>
          <DialogDescription>
            Update the policy details below. Ensure that changes comply with the
            overall resource management guidelines.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Max Limit</Label>
            {isVMPolicy(data) && (
              <AzureVMSizeCombobox
                portal={false}
                selectedValue={selectedVmSize}
                setSelectedValue={setSelectedVmSize}
                defaultValue={data?.name}
              />
            )}
            {isDbPolicy(data) && (
              <Input
                value={dbValue}
                onChange={(e) => setDBValue(e.target.value)}
                placeholder="Enter max database storage in GB"
                type="number"
              />
            )}
            {isStoragePolicy(data) && (
              <Input
                value={storageValue}
                onChange={(e) => setStorageValue(e.target.value)}
                placeholder="Enter max storage in GB"
                type="number"
              />
            )}
          </div>
          <Button
            type="button"
            className="mt-4"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
