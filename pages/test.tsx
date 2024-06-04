// pages/test.js
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";

import { SERVER_URI } from "../constants/apiConstants";

const publicVapidKey = process.env.NEXT_PUBLIC_PWA_KEY; // REPLACE_WITH_YOUR_KEY

const urlBase64ToUint8Array = (base64String) => {
  // 문자열의 길이와 내용 출력
  console.log("Original base64String:", base64String);
  console.log("Length:", base64String.length);

  // 패딩 추가
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  // 패딩 후 문자열과 길이 출력
  console.log("Padded base64String:", base64);
  console.log("Padded Length:", base64.length);

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

const send = async () => {
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
  await fetch(`${SERVER_URI}/webpush/subscribe`, {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json",
    },
  });
  console.log("Push Sent...");
};

function Test() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      send().catch((err) => console.error(err));
    }
  }, []);

  const onClick = async () => {
    console.log(24);
    try {
      await axios.patch(`${SERVER_URI}/user/score/all`);
      console.log("SUC");
    } catch (err) {
      console.error(err);
    }
  };

  return <Button onClick={onClick}>버튼</Button>;
}

export default Test;
