import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Monitor, Database, HardDrive } from "lucide-react"
import { operatingSystems } from "../azure-resource-group-accordion/azure-resource-group-accordion-vm"
import Image from "next/image"
import { Status } from "@/types/api"
import { cn, formatMB } from "@/lib/utils"
import { Engine } from "@/types/resource"
import { AzureRequestDetail } from "@/types/request"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import SSH from "../connect/ssh"
import TextPassword from "@/components/ui/text-password"
import InputWithCopyButton from "../connect/input-with-copy-button"

export default function ResourceAzureConfigSection({
  data,
}: {
  data?: AzureRequestDetail
}) {
  console.log(data?.resources.resourceConfig.AzureVMInstance)
  return (
    <div className="w-full space-y-4">
      {data?.resources.resourceConfig.AzureVMInstance &&
        data.resources.resourceConfig.AzureVMInstance.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="vms" asChild className="py-0">
              <Card className="rounded-sm">
                <AccordionTrigger className="p-4 text-left items-center cursor-pointer">
                  <div className="flex gap-2 items-center">
                    <Monitor size={40} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Virtual Machines</p>
                      <p className="text-xs text-muted-foreground">
                        Request for{" "}
                        {data.resources.resourceConfig.AzureVMInstance.length}{" "}
                        Virtual machines
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="space-y-4">
                    {data.resources.resourceConfig.AzureVMInstance.map(
                      (vm, index) => {
                        const os = operatingSystems.find(
                          (item) => item.value === vm.os
                        )
                        return (
                          <div key={`vm-${index}`}>
                            {data.status === Status.Approved && (
                              <div className="flex mb-1">
                                <AlertDialog>
                                  <AlertDialogTrigger
                                    className={cn(
                                      buttonVariants({
                                        variant: "default",
                                      }),
                                      "ml-auto"
                                    )}
                                  >
                                    Connect
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Connect to {vm.name}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription asChild>
                                        <SSH
                                          ip={"root@192.123.213"}
                                          password={"your_password"}
                                        />
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogAction>
                                        Continue
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}

                            <div className="border rounded-lg p-4 bg-muted/50">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-foreground">
                                    VM Name:
                                  </span>
                                  <p className="text-muted-foreground">
                                    {vm.name}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-foreground">
                                    Size:
                                  </span>
                                  <p className="text-muted-foreground">
                                    {vm.size.name}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-foreground">
                                    CPU Cores:
                                  </span>
                                  <p className="text-muted-foreground">
                                    {vm.size.numberOfCores}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-foreground">
                                    RAM:
                                  </span>
                                  <p className="text-muted-foreground">
                                    {(vm.size.memoryInMB / 1024).toFixed(1)} GB
                                    (
                                    <span className="text-xs">
                                      {vm.size.memoryInMB} MB
                                    </span>
                                    )
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-foreground">
                                    Operating System:
                                  </span>
                                  {os && (
                                    <p className="flex gap-1">
                                      <Image
                                        src={os?.icon}
                                        width={16}
                                        height={16}
                                        alt={`${os?.label} Icon`}
                                      />
                                      <span className="text-muted-foreground">
                                        {os?.label}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    )}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        )}

      {/* Databases */}
      {data?.resources.resourceConfig.AzureDatabase &&
        data.resources.resourceConfig.AzureDatabase.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="dbs" asChild className="py-0 ">
              <Card className=" rounded-sm">
                <AccordionTrigger className="p-4 text-left items-center cursor-pointer">
                  <div className="flex gap-2 items-center">
                    <Database size={40} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Databases</p>
                      <p className="text-xs text-muted-foreground">
                        Request for{" "}
                        {data.resources.resourceConfig.AzureDatabase.length}{" "}
                        Database
                        {data.resources.resourceConfig.AzureDatabase.length > 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="space-y-4">
                    {data.resources.resourceConfig.AzureDatabase.map(
                      (db, index) => (
                        <div key={`db-${index}`}>
                          {data.status === Status.Approved && (
                            <div className="flex mb-1">
                              <AlertDialog>
                                <AlertDialogTrigger
                                  className={cn(
                                    buttonVariants({
                                      variant: "default",
                                    }),
                                    "ml-auto"
                                  )}
                                >
                                  Connect
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Connect to {db.name}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                      <InputWithCopyButton
                                        label="Connection String"
                                        value={
                                          "Server=your_server.database.windows.net;Database=your_database;User Id=your_username;Password=your_password;"
                                        }
                                      />
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogAction>
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}

                          <div className="border rounded-lg p-4 bg-muted/50">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-foreground">
                                  Name:
                                </span>
                                <p className="text-muted-foreground">
                                  {db.name}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-foreground">
                                  Database Engine:
                                </span>
                                <p className="text-muted-foreground">
                                  {db.engine}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-foreground">
                                  Username:
                                </span>
                                <p className="text-muted-foreground">
                                  {db.username}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-foreground">
                                  Password:
                                </span>
                                <div className="text-muted-foreground">
                                  <TextPassword
                                    text={db.password}
                                    copyButton={true}
                                  />
                                </div>
                              </div>
                              {db.engine === Engine.PostgreSQL && (
                                <div>
                                  <span className="font-medium text-foreground">
                                    Storage:
                                  </span>
                                  <p className="text-muted-foreground">
                                    {formatMB(db.storageGB)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        )}

      {/* Storage */}
      {data?.resources.resourceConfig.AzureStorage &&
        data.resources.resourceConfig.AzureStorage.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sts" asChild className="py-0 ">
              <Card className=" rounded-sm">
                <AccordionTrigger className="p-4 text-left items-center cursor-pointer">
                  <div className="flex gap-2 items-center">
                    <HardDrive size={40} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Storage</p>
                      <p className="text-xs text-muted-foreground">
                        Request for{" "}
                        {data.resources.resourceConfig.AzureStorage.length}{" "}
                        Storage instance
                        {data.resources.resourceConfig.AzureStorage.length > 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="space-y-4">
                    {data.resources.resourceConfig.AzureStorage.map(
                      (storage, index) => (
                        <div key={`storage-${index}`}>
                          {data.status === Status.Approved && (
                            <div className="flex mb-1">
                              <AlertDialog>
                                <AlertDialogTrigger
                                  className={cn(
                                    buttonVariants({
                                      variant: "default",
                                    }),
                                    "ml-auto"
                                  )}
                                >
                                  Connect
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Connect to {storage.name}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                      <InputWithCopyButton
                                        label="Connection String"
                                        value={
                                          "Server=your_server.database.windows.net;Database=your_database;User Id=your_username;Password=your_password;"
                                        }
                                      />
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogAction>
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}

                          <div className="border rounded-lg p-4 bg-muted/50">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-foreground">
                                  Name:
                                </span>
                                <p className="text-muted-foreground">
                                  {storage.name}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-foreground">
                                  SKU:
                                </span>
                                <p className="text-muted-foreground">
                                  {storage.sku}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-foreground">
                                  Access Tier:
                                </span>
                                <p className="text-muted-foreground">
                                  {storage.accessTier}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-foreground">
                                  Kind:
                                </span>
                                <p className="text-muted-foreground">
                                  {storage.kind}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        )}
    </div>
  )
}
