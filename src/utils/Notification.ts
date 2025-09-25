// src/utils/notification.ts
export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) return "denied";
    return await Notification.requestPermission();
  };

export const showNotification = (
  title: string,
  options?: NotificationOptions,
  fallbackText?: string
) => {
  // Browser native notification
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, options);
      return;
    } catch (e) {
      // fallthrough to toast
    }
  }

  // Fallback: simple toast DOM element
  const containerId = "app-toast-container";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.cssText =
      "position:fixed;top:1rem;right:1rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;";
    document.body.appendChild(container);
  }

  const el = document.createElement("div");
  el.style.cssText =
    "background:#111827;color:#fff;padding:.6rem 1rem;border-radius:.5rem;box-shadow:0 6px 18px rgba(0,0,0,.2);";
  el.textContent = fallbackText ?? title;
  container.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 400);
  }, 3000);
};
