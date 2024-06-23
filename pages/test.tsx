// pages/test.js
import { Button } from "@chakra-ui/react";
import axios from "axios";

import { SERVER_URI } from "../constants/apiConstants";

const publicVapidKey = process.env.NEXT_PUBLIC_PWA_KEY; // REPLACE_WITH_YOUR_KEY

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  let rawData;
  try {
    rawData = window.atob(base64);
  } catch (e) {
    console.error("Failed to decode base64 string:", e);
    throw new Error("The string to be decoded is not correctly encoded.");
  }

  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

const requestNotificationPermission = async () => {
  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

const send = async (onSuccess) => {
  try {
    // Register Service Worker
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/pwabuilder-sw.js", {
      scope: "/",
    });
    console.log("Service Worker Registered...");

    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log("Push Registered...");

    // Send Push Notification
    console.log("Sending Push...");

    await axios.post(`${SERVER_URI}/webpush/subscribe`, subscription);
    console.log("Push Sent...");

    if (onSuccess) onSuccess(); // onSuccess 함수 호출
  } catch (err) {
    console.error(err);
  }
};

function Test() {
  const onClick = async () => {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      alert(
        "Notification permission denied or not granted. Please enable notifications in your browser settings.",
      );
      return;
    }

    send(() => {
      console.log("Push registration successful and additional function executed.");
    }).catch((err) => console.error(err));
  };

  return <Button onClick={onClick}>버튼</Button>;
}

export default Test;
