import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { SettingsPanelTrigger } from "@/components/settings-panel";
import {
  RiCodeSSlashLine,
  RiShareLine,
  RiShareCircleLine,
} from "@remixicon/react";

export function ChatHeader() {
  return (
    <div className="py-5 bg-background sticky top-0 z-10 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
      <div className="flex items-center justify-between gap-2">
        <Breadcrumb>
          <BreadcrumbList className="sm:gap-1.5">
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Playground</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chat</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-1 -my-2 -me-2">
          <Button variant="ghost" className="px-2">
            <RiCodeSSlashLine
              className="text-muted-foreground sm:text-muted-foreground/70 size-5"
              size={20}
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Code</span>
          </Button>
          <Button variant="ghost" className="px-2">
            <RiShareLine
              className="text-muted-foreground sm:text-muted-foreground/70 size-5"
              size={20}
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Share</span>
          </Button>
          <Button variant="ghost" className="px-2">
            <RiShareCircleLine
              className="text-muted-foreground sm:text-muted-foreground/70 size-5"
              size={20}
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Export</span>
          </Button>
          <SettingsPanelTrigger />
        </div>
      </div>
    </div>
  );
}
