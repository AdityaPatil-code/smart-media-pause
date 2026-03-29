// Prevent duplicate execution
if (!window.__SMART_PAUSE__) {
  window.__SMART_PAUSE__ = true;

  let lastPauseTime = 0;
  let currentMedia = null;

  //  Get active media element
  function getMedia() {
    return document.querySelector("video") || document.querySelector("audio");
  }

  //  Get toggle state safely
  function getEnabled(callback) {
    try {
      if (!chrome?.storage?.sync) {
        callback(true);
        return;
      }

      chrome.storage.sync.get(["enabled"], (data) => {
        callback(data?.enabled !== false);
      });
    } catch {
      callback(true);
    }
  }

  //  Pause media
  function pause(media) {
    if (!media || media.paused) return;

    console.log("⏸ Pausing media");
    media.pause();
    lastPauseTime = Date.now();
  }

  //  Play media (Brave-proof)
  function play(media) {
    if (!media || !media.paused) return;

    console.log("▶ Resuming media");

    //  Brave autoplay workaround
    try {
      media.muted = true;
    } catch {}

    const promise = media.play();

    if (promise !== undefined) {
      promise
        .then(() => {
          console.log("✅ Playback resumed");

          // Restore sound after slight delay
          setTimeout(() => {
            try {
              media.muted = false;
            } catch {}
          }, 200);
        })
        .catch((err) => {
          console.log("❌ Autoplay blocked:", err);
        });
    }

    //  Track time saved
    if (lastPauseTime) {
      const saved = Date.now() - lastPauseTime;

      try {
        chrome.storage.local.get(["timeSaved"], (data) => {
          chrome.storage.local.set({
            timeSaved: (data.timeSaved || 0) + saved
          });
        });
      } catch {}
    }
  }

  //  Handle visibility change
  function handleVisibility() {
    getEnabled((enabled) => {
      const media = getMedia();
      if (!media) return;

      console.log("Enabled:", enabled, "| Hidden:", document.hidden);

      if (!enabled) {
        play(media);
        return;
      }

      if (document.hidden) {
        pause(media);
      } else {
        play(media);
      }
    });
  }

  //  Initialize system
  function start() {
    console.log("🚀 Smart Media Pause started");

    //  Detect media changes (YouTube/Netflix fix)
    setInterval(() => {
      const media = getMedia();

      if (media && media !== currentMedia) {
        currentMedia = media;
        console.log("🎬 New media detected");
      }
    }, 1000);

    //  Tab visibility
    document.addEventListener("visibilitychange", handleVisibility);

    //  Brave fallback (important)
    window.addEventListener("focus", handleVisibility);
    window.addEventListener("blur", handleVisibility);

    //  Real-time toggle sync
    try {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.enabled) {
          const media = getMedia();
          if (!media) return;

          const enabled = changes.enabled.newValue;

          console.log("🔁 Toggle changed:", enabled);

          if (!enabled) {
            play(media); // resume immediately if disabled
          }
        }
      });
    } catch (e) {
      console.log("Storage listener error:", e);
    }
  }

  //  Start safely
  try {
    start();
  } catch (e) {
    console.log("❌ Startup error:", e);
  }
}