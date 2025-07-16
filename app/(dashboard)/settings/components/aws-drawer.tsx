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

export default function AwsDrawer() {
  return (
    <Drawer direction="right">
      <DrawerTrigger className="flex items-center justify-center gap-2 hover:underline cursor-pointer">
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
          <DrawerTitle>Configure AWS</DrawerTitle>
          <DrawerDescription>
            Set up your AWS cloud provider configuration.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
