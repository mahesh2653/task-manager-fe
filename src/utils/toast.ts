import { toast } from "react-toastify";

export const toastSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    className: "text-center",
  });
};

export const toastInfo = (message: string) => {
  toast.info(message, {
    position: "top-center",
    autoClose: 3000,
    className: "text-center",
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    className: "text-center",
  });
};
