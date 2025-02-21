import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { cn } from "../../lib/utils";

export const Dialog = ({ open, onOpenChange, children }) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    {children}
  </DialogPrimitive.Root>
);

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <DialogPrimitive.Content ref={ref} {...props}>
        <VisuallyHidden>
          <DialogTitle>Hidden Dialog Title</DialogTitle>
        </VisuallyHidden>
        {props.children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);

export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-bold">{children}</h2>
);

export const DialogFooter = ({ children }) => (
  <div className="mt-4 flex justify-end space-x-2">{children}</div>
);
