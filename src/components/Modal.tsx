import React, { type PropsWithChildren } from "react";

export default function Modal({
  open, title, onClose, children, footer
}: PropsWithChildren<{ open: boolean; title?: string; onClose: ()=>void; footer?: React.ReactNode }>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:w-[420px] bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl shadow-card dark:shadow-cardDark p-4">
        {title && <div className="text-base font-semibold mb-2">{title}</div>}
        <div>{children}</div>
        {footer && <div className="mt-3">{footer}</div>}
      </div>
    </div>
  );
}
