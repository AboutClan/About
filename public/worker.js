self.addEventListener("push", (event) => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data?.body,
    badge: data?.badge,
    data: data?.data || { url: "/", notificationType: "default" },
    icon: data?.icon,
    tag: data?.tag,
    requireInteraction: data?.requireInteraction || true,
    silent: data?.silent,
    renotify: data?.renotify || true,
    timestamp: data?.timestamp || Date.now(),
    vibrate: data?.vibrate,
    actions: data?.actions || [
      {
        action: "https://studyabout.herokuapp.com/home",
        title: "ABOUT",
        icon: data.icon,
      },
    ],
    dir: data?.dir,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Close the notification

  const targetUrl = event.notification.data.url; // Get the URL from the notification data
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      const hadWindowToFocus = clientList.some((windowClient) => {
        if (windowClient.url === targetUrl) {
          windowClient.focus();
          return true;
        }
        return false;
      });

      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        self.clients
          .openWindow(targetUrl)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    }),
  );
});
