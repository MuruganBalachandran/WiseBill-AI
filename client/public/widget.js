// region wisebill ai embeddable widget script
(function () {
  // locate target container or fallback to body
  const scriptTag = document.currentScript;
  const containerId = scriptTag?.getAttribute('data-container') || 'wisebill-widget';
  const container = document.getElementById(containerId) || scriptTag?.parentNode || document.body;

  // calculate base app url
  const appUrl = (scriptTag && scriptTag.src)
    ? new URL(scriptTag.src).origin
    : (window.WISEBILL_APP_URL || 'http://localhost:3000');

  // create responsive iframe
  const iframe = document.createElement('iframe');
  iframe.src = `${appUrl}/widget`;
  iframe.title = 'WiseBill AI Spend Auditor';
  iframe.style.width = '100%';
  iframe.style.height = '680px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.backgroundColor = 'transparent';

  container.appendChild(iframe);
})();
// endregion
