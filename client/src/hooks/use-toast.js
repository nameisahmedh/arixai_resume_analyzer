import * as React from "react";

const ToastContext = React.createContext(undefined);

export function Toaster() {
  return <div className="fixed bottom-0 right-0 p-4 space-y-2" />;
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within Toaster");
  }
  return context;
}
