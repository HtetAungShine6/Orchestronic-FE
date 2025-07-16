import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Image from "next/image"

export default function AzureDrawer() {
  return (
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
          <DrawerTitle>Configure Azure</DrawerTitle>
          <DrawerDescription>
            Set up your Azure cloud provider configuration.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
