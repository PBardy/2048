// Enable PWA Features
// ...

let deferredPrompt;

// Listen for the before install prompt event so we can
// prompt the user when they click our install button.
window.addEventListener('beforeinstallprompt', (e) => {
  console.log(e);
  e.preventDefault();
  deferredPrompt = e;
});

// Get DOM elements involved in the PWA installation process
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('installbutton').addEventListener('click', (e) => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') console.log('Accepted installation');
    });
  });
});

// Listen for the app installation event
window.addEventListener('appinstalled', (e) => {
  console.log('App installed');
});

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js');
  });
}