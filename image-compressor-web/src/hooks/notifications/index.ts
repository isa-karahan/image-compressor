import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { HubConnectionBuilder } from "@microsoft/signalr";

import { publicRuntimeConfig } from "@/../next.config";

export function useNotifications(onNotify: Function) {
  const connection = useMemo(
    () =>
      new HubConnectionBuilder()
        .withUrl(`${publicRuntimeConfig?.apiURL}/hubs`)
        .withAutomaticReconnect()
        .build(),
    []
  );

  console.log("rendered");

  const startConnection = useCallback(async () => {
    try {
      await connection.start();
      console.log("start");

      connection.on("NotifyCompleteCompressingProcess", () => {
        toast.success("Image compression process is completed.");
        onNotify();
      });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  }, [connection, onNotify]);

  useEffect(() => {
    console.log("useEffect");
    startConnection();
  }, [startConnection]);

  return connection;
}
