"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Cpu, Database, DatabaseZap, Pencil } from "lucide-react"
import { useSession } from "next-auth/react"
import { ReactNode, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { haveAdminOrIT } from "@/lib/utils"
import Image from "next/image"
import { AzureVMSizeCombobox } from "@/components/requests/resource-group-accordion-vm"
import { VmSizeDto } from "@/types/request"

const memoryLimit = 32 // in GB
const storageLimitSSD = 500 // in GB
const cpuCoresLimit = 16 // in cores

interface Policy {
  icon: ReactNode
  name: string
  description: string
  max: string[]
  filter?: ReactNode
}

export default function PolicySection() {
  //TODO(jan): call API
  const [selectedValue, setSelectedValue] = useState<VmSizeDto | undefined>()

  const azurePolicies: Policy[] = [
    {
      icon: <Cpu size={16} />,
      name: "VM",
      description: `Teams can request up to ${cpuCoresLimit} CPU cores per environment.
  Any requests beyond this threshold will be reviewed by the operations team and require justification.`,
      max: [
        `${selectedValue?.numberOfCores} vCPUs`,
        `${Math.round((selectedValue?.memoryInMB ?? 0) / 1024)} GB of RAM`,
      ],
      filter: (
        <AzureVMSizeCombobox
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          portal={false}
        />
      ),
    },
    {
      icon: <DatabaseZap size={16} />,
      name: "Storage",
      description: `Each project is allocated ${storageLimitSSD}GB of SSD storage.
Requests above this limit will trigger a review and must receive PM approval.`,
      max: [`${storageLimitSSD} GB`],
    },
    {
      icon: <Database size={16} />,
      name: "Database",
      description: `Each project can utilize up to ${memoryLimit}GB of memory for database operations.`,
      max: [`${memoryLimit} GB`],
    },
  ]

  const awsPolicies: Policy[] = [
    {
      icon: <Cpu size={16} />,
      name: "VM",
      description: `Teams can request up to ${cpuCoresLimit} CPU cores per environment.
  Any requests beyond this threshold will be reviewed by the operations team and require justification.`,
      max: [
        `${selectedValue?.numberOfCores} Cores`,
        `${selectedValue?.memoryInMB} MB`,
      ],
      filter: (
        <AzureVMSizeCombobox
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          portal={false}
        />
      ),
    },
    {
      icon: <DatabaseZap size={16} />,
      name: "Storage",
      description: `Each project is allocated ${storageLimitSSD}GB of SSD storage.
Requests above this limit will trigger a review and must receive PM approval.`,
      max: [`${storageLimitSSD} GB`],
    },
    {
      icon: <Database size={16} />,
      name: "Database",
      description: `Each project can utilize up to ${memoryLimit}GB of memory for database operations.`,
      max: [`${memoryLimit} GB`],
    },
  ]

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-4">
          <Image
            src="/icon/azure.svg"
            alt="Azure Cloud Provider Icon"
            width={24}
            height={24}
          />
          <p>Azure</p>
        </div>
        <Separator className="mb-4" />
        {azurePolicies.map((policy, index) => (
          <PolicyCard
            key={policy.name}
            policy={policy}
            index={index}
            totalPolicies={azurePolicies.length}
          />
        ))}
      </div>
      <div className="flex items-stretch">
        <Separator orientation="vertical" className="h-full" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-4">
          <Image
            src="/icon/aws.svg"
            alt="AWS Cloud Provider Icon"
            width={24}
            height={24}
          />
          <p>AWS</p>
        </div>
        <Separator className="mb-4" />

        {awsPolicies.map((policy, index) => (
          <PolicyCard
            key={policy.name}
            policy={policy}
            index={index}
            totalPolicies={awsPolicies.length}
          />
        ))}
      </div>
    </div>
  )
}

function PolicyCard({
  policy,
  index,
  totalPolicies,
}: {
  policy: Policy
  index: number
  totalPolicies: number
}) {
  const { data: session } = useSession()
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {policy.icon}
          <h3 className="font-medium">{policy.name}</h3>
        </div>
        {haveAdminOrIT(session?.user.role) && (
          <EditPolicyDialog policy={policy} />
        )}
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <p className="text-sm text-muted-foreground">Max:</p>
          {policy.max.map((maxValue, idx) => (
            <p key={idx} className="mt-2">
              {maxValue}
            </p>
          ))}
        </div>
        <div className="grid gap-2 w-1/2">
          <p className="text-sm text-muted-foreground">Description</p>
          <p>{policy.description}</p>
        </div>
      </div>
      {index !== totalPolicies - 1 && (
        <div className="my-6">
          <Separator />
        </div>
      )}
    </div>
  )
}

function EditPolicyDialog({ policy }: { policy: Policy }) {
  return (
    <Dialog>
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
            <Label>Name</Label>
            <Input type="text" defaultValue={policy.name} />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea defaultValue={policy.description} />
          </div>

          {policy.filter ? (
            <div className="grid gap-2">
              <Label>Max Limit</Label>
              {policy.filter}
            </div>
          ) : (
            <div className="grid gap-2">
              <Label>Max Limit</Label>
              <Input type="text" defaultValue={policy.max} />
            </div>
          )}
          <Button type="submit" className="mt-4">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
