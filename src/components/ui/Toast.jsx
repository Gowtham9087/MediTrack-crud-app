import { Toaster } from "react-hot-toast";

function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#111827",
          color: "#fff",
          borderRadius: "16px",
          padding: "14px 18px",
          fontWeight: "600",
        },
      }}
    />
  );
}

export default Toast;