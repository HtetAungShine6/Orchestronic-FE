import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { RequestDetail } from "./request-detail"
import { Monitor, Database, HardDrive } from "lucide-react"
import { operatingSystems } from "../resource-group-accordion-vm"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Status } from "@/types/api"

export default function ResourceConfigSection({
  data,
}: {
  data?: RequestDetail
}) {
  return (
    <div className="w-full space-y-4">
      {data?.resources.resourceConfig.vms &&
        data.resources.resourceConfig.vms.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="vms" asChild className="py-0">
              <Card className="rounded-sm">
                <AccordionTrigger className="p-4 text-left items-center cursor-pointer">
                  <div className="flex gap-2 items-center">
                    <Monitor size={40} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Virtual Machines</p>
                      <p className="text-xs text-muted-foreground">
                        Request for {data.resources.resourceConfig.vms.length}{" "}
                        Virtual machines
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="space-y-4">
                    {data.resources.resourceConfig.vms.map((vm, index) => {
                      const os = operatingSystems.find(
                        (item) => item.value === vm.os
                      )
                      return (
                        <div key={`vm-${index}`}>
                          {data.status === Status.Approved && (
                            <div className="flex mb-1">
                              <Button className="ml-auto">Connect to VM</Button>
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
                                  {(vm.size.memoryInMB / 1024).toFixed(1)} GB (
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
                    })}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        )}

      {/* Databases */}
      {data?.resources.resourceConfig.dbs &&
        data.resources.resourceConfig.dbs.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="dbs" asChild className="py-0 ">
              <Card className=" rounded-sm">
                <AccordionTrigger className="p-4 text-left items-center cursor-pointer">
                  <div className="flex gap-2 items-center">
                    <Database size={40} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Databases</p>
                      <p className="text-xs text-muted-foreground">
                        Request for {data.resources.resourceConfig.dbs.length}{" "}
                        Database
                        {data.resources.resourceConfig.dbs.length > 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="space-y-4">
                    {data.resources.resourceConfig.dbs.map((db, index) => (
                      <div
                        key={`db-${index}`}
                        className="border rounded-lg p-4 bg-muted/50"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-foreground">
                              Database Engine:
                            </span>
                            <p className="text-muted-foreground">{db.engine}</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">
                              Storage:
                            </span>
                            <p className="text-muted-foreground">
                              {db.storageGB} GB
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        )}

      {/* Storage */}
      {data?.resources.resourceConfig.sts &&
        data.resources.resourceConfig.sts.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sts" asChild className="py-0 ">
              <Card className=" rounded-sm">
                <AccordionTrigger className="p-4 text-left items-center cursor-pointer">
                  <div className="flex gap-2 items-center">
                    <HardDrive size={40} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Storage</p>
                      <p className="text-xs text-muted-foreground">
                        Request for {data.resources.resourceConfig.sts.length}{" "}
                        Storage instance
                        {data.resources.resourceConfig.sts.length > 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="space-y-4">
                    {data.resources.resourceConfig.sts.map((storage, index) => (
                      <div
                        key={`storage-${index}`}
                        className="border rounded-lg p-4 bg-muted/50"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-foreground">
                              Storage Type:
                            </span>
                            <p className="text-muted-foreground">
                              {storage.type}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">
                              Capacity:
                            </span>
                            <p className="text-muted-foreground">
                              {storage.capacityGB} GB
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        )}
    </div>
  )
}
