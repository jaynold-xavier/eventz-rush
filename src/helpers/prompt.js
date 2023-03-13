import { Modal } from "antd";

export default function confirmChanges(isDirty, confirmPops = {}) {
  if (isDirty) {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: "Confirm Close",
        content: "Unsaved changes will be lost. Do you want to continue?",
        onOk: () => resolve(isDirty),
        onCancel: () => reject(),
        ...confirmPops,
      });
    });
  } else {
    return Promise.resolve(isDirty);
  }
}
