import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image"
import { Separator } from "@radix-ui/react-separator"

export default function SettingsSection() {
  return (
    <Accordion type="single" collapsible className="w-1/2">
      <AccordionItem value="cloud-providers">
        <AccordionTrigger className=" cursor-pointer">
          Cloud Providers
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <Drawer direction="right">
            <DrawerTrigger className="flex items-center justify-center gap-2 hover:underline cursor-pointer">
              <Image
                src="/icon/azure.svg"
                alt="Azure Cloud Provider Icon"
                width={24}
                height={24}
              />
              Azure
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose className="w-full">
                  <Button className="w-full" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <br />
          <Drawer direction="right">
            <DrawerTrigger className="flex items-center justify-center gap-2 hover:underline cursor-pointer ">
              <Image
                src="/icon/aws.svg"
                alt="AWS Cloud Provider Icon"
                width={24}
                height={24}
              />
              AWS
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose className="w-full">
                  <Button className="w-full" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </AccordionContent>
      </AccordionItem>
      <Separator />
    </Accordion>
  )
}
