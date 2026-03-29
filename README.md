# 🎬 Smart Media Pause

Automatically pauses videos or music when you switch tabs and resumes playback when you return — helping you stay focused and save time.

---

## 🚀 Features

- ⏸ Auto pause on tab switch
- ▶ Auto resume when you return
- 🎯 Works on:
  - YouTube
  - Netflix
  - Spotify
- 🔘 Toggle ON/OFF anytime
- 📊 Tracks total time saved
- ⚡ Optimized for Chrome & Brave

---

## 🧠 How It Works

This extension uses the browser's `visibilitychange` API to detect when the user switches tabs and controls media playback accordingly.

Additional handling ensures compatibility with browsers like Brave, which restrict autoplay behavior.

---

## 🛠 Tech Stack

- JavaScript
- Chrome Extension (Manifest v3)
- HTML & CSS

---

## 📦 Installation

1. Go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select this project folder

---

## 📁 Project Structure

- `content.js` → Core logic for media control  
- `manifest.json` → Extension configuration  
- `popup.html/css/js` → UI and controls  

---

## 📊 Use Case

- Avoid missing important parts of videos
- Prevent unnecessary playback when multitasking
- Track how much time you save automatically

---

## ⚠️ Notes

- For Brave users:
  - Enable autoplay in settings
  - Disable shields for best performance

---

## 👨‍💻 Author

Aditya Patil
