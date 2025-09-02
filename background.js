// Optional: confirm Chrome granted notification permission
chrome.notifications.getPermissionLevel((level) =>
  console.log("Notif permission:", level)
);

// Helper to show a system notification with error logging
function showNotif(title, message) {
  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: chrome.runtime.getURL("logo.png"),
      title,
      message,
      priority: 2,
      requireInteraction: false
    },
    (id) => {
      if (chrome.runtime.lastError) {
        console.error("notifications.create error:", chrome.runtime.lastError.message);
      } else {
        console.log("Notification created:", id);
      }
    }
  );
}

// Receive schedule requests from popup.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "SCHEDULE_ISHA_ALERT" && typeof msg.whenMs === "number") {
    const alertAt = msg.whenMs - 30 * 60 * 1000; // 30 minutes before
    const when = Math.max(Date.now() + 2000, alertAt); // never in the past
    const alarmName = `isha-${Math.floor(when)}`;

    chrome.alarms.create(alarmName, { when });
    console.log("Isha alarm scheduled:", { alarmName, when: new Date(when).toString() });

    sendResponse({ ok: true, alarmName, scheduledAt: when });
  }
  return true; // keep sendResponse channel open if needed
});

// Single onAlarm handler for all alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Alarm fired:", alarm.name);

  if (alarm.name?.startsWith("isha-")) {
    showNotif("Isha is ending in 30 minutes");
  } 
});

