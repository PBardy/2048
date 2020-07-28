let buttonInstall;
let deferredPrompt;
let installPromotion;

function onError(event) {
  console.error(event);
}

function onServiceWorkerRegistration(registration) {
  console.log(registration);
}

function main() {
  navigator.serviceWorker.register('../src/sw.js')
    .then(onServiceWorkerRegistration, onError);

  buttonInstall = document.querySelector('#button-install');
  buttonInstall.addEventListener('click', (e) => {
    if(deferredPrompt == null) return;
    deferredPrompt.prompt();
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', main, false);
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPromotion();
});