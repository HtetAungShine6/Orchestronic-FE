"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Role } from "@/types/role"
import {
  Cpu,
  DatabaseZap,
  HardDrive,
  MemoryStick,
  Network,
  Pencil,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { ReactNode } from "react"

const memoryLimit = 32 // in GB
const storageLimitHDD = 1 // in TB
const storageLimitSSD = 500 // in GB
const cpuCoresLimit = 16 // in cores
const networkBandwidthLimit = 1 // in Gbps

interface Policy {
  icon: ReactNode
  name: string
  description: string
  max: string
}

const policies: Policy[] = [
  {
    icon: <MemoryStick size={16} />,
    name: "Memory",
    description: `Each team may request a maximum of ${memoryLimit}GB of RAM across all active environments.
Requests exceeding this limit will be flagged for review and require project manager (PM) approval.`,
    max: `${memoryLimit} GB`,
  },
  {
    icon: <HardDrive size={16} />,
    name: "Storage - Hard Disk Drive (HDD)",
    description: `The maximum HDD storage allowed per project is ${storageLimitHDD}TB.
Requests for additional HDD storage must be formally justified and approved by the PM.`,
    max: `${storageLimitHDD} TB`,
  },
  {
    icon: <DatabaseZap size={16} />,
    name: "Storage - Solid State Drive (SSD)",
    description: `Each project is allocated ${storageLimitSSD}GB of SSD storage.
Requests above this limit will trigger a review and must receive PM approval.`,
    max: `${storageLimitSSD} GB`,
  },
  {
    icon: <Cpu size={16} />,
    name: "CPU Cores",
    description: `Teams can request up to ${cpuCoresLimit} CPU cores per environment.
Any requests beyond this threshold will be reviewed by the operations team and require justification.`,
    max: `${cpuCoresLimit} Cores`,
  },
  {
    icon: <Network size={16} />,
    name: "Network Bandwidth",
    description: `Each project is allocated a maximum of ${networkBandwidthLimit}Gbps network bandwidth.
Requests for higher bandwidth must be justified and approved by the PM.`,
    max: `${networkBandwidthLimit} Gbps`,
  },
]

export default function PagePolicySection() {
  return (
    <div className="flex flex-col">
      {policies.map((policy, index) => (
        <PolicyCard key={policy.name} policy={policy} index={index} />
      ))}
    </div>
  )
}

function PolicyCard({ policy, index }: { policy: Policy; index: number }) {
  const { data: session } = useSession()
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {policy.icon}
          <h3 className="font-medium">{policy.name}</h3>
        </div>
        {session?.user?.role === Role.IT && (
          <Button variant="outline" size="sm">
            <Pencil /> Edit
          </Button>
        )}
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <p className="text-sm text-muted-foreground">Max:</p>
          <p className="mt-2">{policy.max}</p>
        </div>
        <div className="grid gap-2 w-1/2">
          <p className="text-sm text-muted-foreground">Description</p>
          <p>{policy.description}</p>
        </div>
      </div>
      {index !== policies.length - 1 && (
        <div className="my-6">
          <Separator />
        </div>
      )}
    </div>
  )
}
