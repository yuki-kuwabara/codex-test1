chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'applyTemplate' && msg.fields) {
    for (const [name, value] of Object.entries(msg.fields)) {
      const elems = document.getElementsByName(name);
      if (!elems.length) continue;
      const elem = elems[0];
      const type = elem.type;
      if (type === 'radio') {
        for (const e of elems) {
          e.checked = (e.value == value);
          e.dispatchEvent(new Event('input', { bubbles: true }));
          e.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else if (type === 'checkbox') {
        const checked = value === true || value === 'true' || value == elem.value;
        elem.checked = checked;
        elem.dispatchEvent(new Event('input', { bubbles: true }));
        elem.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        elem.value = value;
        elem.dispatchEvent(new Event('input', { bubbles: true }));
        elem.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }
});
