const script = chrome.extension.getURL('injected/injected.js');

const s = document.createElement('script');
s.type = 'text/javascript';
s.src = script;

// eslint-disable-next-line func-names
s.onload = function() {
  this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);
