const toggle = document.getElementById("toggle");
const status = document.getElementById("status");
const timeText = document.getElementById("time");

// Load initial state
chrome.storage.sync.get(["enabled"], (data) => {
  const isEnabled = data.enabled ?? true;

  toggle.checked = isEnabled;
  status.textContent = isEnabled ? "Enabled" : "Disabled";
});

// Handle toggle change (MERGED)
toggle.addEventListener("change", () => {
  const isEnabled = toggle.checked;

  // Save state
  chrome.storage.sync.set({ enabled: isEnabled });

  // Update UI
  status.textContent = isEnabled ? "Enabled" : "Disabled";

  // 🎨 Animation
  document.body.style.transform = "scale(0.95)";
  setTimeout(() => {
    document.body.style.transform = "scale(1)";
  }, 120);
});

// Load analytics
function updateTime() {
  chrome.storage.local.get(["timeSaved"], (data) => {
    const ms = data.timeSaved || 0;

    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);

    timeText.textContent = `${hours}h ${minutes % 60}m saved`;
  });
}

updateTime();

// Auto-update analytics live
setInterval(updateTime, 3000);

// Sync UI if changed elsewhere
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    const newVal = changes.enabled.newValue;

    toggle.checked = newVal;
    status.textContent = newVal ? "Enabled" : "Disabled";
  }
});