document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('templateSelect');

  chrome.storage.sync.get({ templates: [] }, ({ templates }) => {
    templates.forEach(tpl => {
      const opt = document.createElement('option');
      opt.value = tpl.name;
      opt.textContent = tpl.name;
      opt.dataset.fields = JSON.stringify(tpl.fields || {});
      select.appendChild(opt);
    });
  });

  document.getElementById('apply').addEventListener('click', () => {
    const selected = select.options[select.selectedIndex];
    if (!selected) return;
    const fields = JSON.parse(selected.dataset.fields);
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'applyTemplate', fields });
    });
  });

  document.getElementById('openOptions').addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
});
