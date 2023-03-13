import { ExclamationCircleFilled } from "@ant-design/icons";
import { UNSAFE_NavigationContext } from "react-router-dom";
import { useRef, useEffect, useCallback, useContext, useState } from "react";

import confirmChanges from "../helpers/prompt";

export default function usePrompt({ when, onOk, onCancel, ...rest }) {
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const retryFn = useRef(() => {});

  const handleOk = useCallback(
    async (retry) => {
      const confirm = await Promise.resolve(onOk());
      if (confirm) {
        setConfirmedNavigation(true);
        retryFn.current = retry;
      }
    },
    [retryFn, onOk]
  );

  const handleCancel = useCallback(
    async (retry) => {
      const confirm = await Promise.resolve(onCancel());
      if (confirm) {
        setConfirmedNavigation(false);
        retryFn.current = retry;
      }
    },
    [retryFn, onCancel]
  );

  useEffect(() => {
    if (confirmedNavigation) {
      retryFn.current();
    }
  }, [confirmedNavigation]);

  const handleBlockNavigation = useCallback(
    ({ retry }) => {
      const shouldDisplayPrompt = typeof when === "boolean" ? when : when();
      if (shouldDisplayPrompt) {
        confirmChanges(true, {
          title: "Confirm Exit",
          icon: <ExclamationCircleFilled />,
          content: "If you leave this page, all unsaved changes",
          okText: "Save and Continue",
          cancelText: "Leave",
          onOk: () => handleOk(retry),
          onCancel: () => handleCancel(retry),
          ...rest,
        });
      } else {
        retry();
      }
    },
    [handleOk, handleCancel]
  );

  useBlocker(handleBlockNavigation, !confirmedNavigation);
}

function useBlocker(blocker, when = true) {
  const { navigator } = useContext(UNSAFE_NavigationContext);

  useEffect(() => {
    if (!when || !navigator.block) return;
    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };
      blocker(autoUnblockingTx);
    });
    return unblock;
  }, [navigator, blocker, when]);
}
