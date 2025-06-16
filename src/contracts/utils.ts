import { toast } from "react-toastify";

export const showToast = (txt: any, duration = 5000, ty = 0) => {
  // let type = toast.TYPE.SUCCESS;
  // if (ty === 1) type = toast.TYPE.ERROR;
  // if (ty === 2) type = toast.TYPE.INFO;

  let autoClose: any;
  if (duration < 0) {
    autoClose = false;
  }

  if (ty === 0) {
    return toast.success(txt, {
      position: "bottom-left",
      autoClose,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      // type,
      theme: "colored",
    });
  } else if (ty === 1) {
    return toast.error(txt, {
      position: "bottom-left",
      autoClose,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      // type,
      theme: "colored",
    });
  } else {
    return toast.info(txt, {
      position: "bottom-left",
      autoClose,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      // type,
      theme: "colored",
    });
  }
};
