function qs(id){return document.getElementById(id);} // helper

function addFieldRow(name='', value=''){
  const tbody = qs('fields').querySelector('tbody');
  const tr = document.createElement('tr');
  const tdName = document.createElement('td');
  const nameInput = document.createElement('input');
  nameInput.type='text';
  nameInput.className='field-name';
  nameInput.value=name;
  tdName.appendChild(nameInput);
  const tdValue = document.createElement('td');
  const valueInput = document.createElement('input');
  valueInput.type='text';
  valueInput.className='field-value';
  valueInput.value=value;
  tdValue.appendChild(valueInput);
  const tdDel = document.createElement('td');
  const delBtn = document.createElement('button');
  delBtn.textContent='×';
  delBtn.addEventListener('click', () => tr.remove());
  tdDel.appendChild(delBtn);
  tr.appendChild(tdName);
  tr.appendChild(tdValue);
  tr.appendChild(tdDel);
  tbody.appendChild(tr);
}

function loadTemplates(){
  chrome.storage.sync.get({templates:[]}, ({templates}) => {
    const select = qs('templateSelect');
    select.innerHTML='';
    templates.forEach(t => {
      const opt=document.createElement('option');
      opt.value=t.name; opt.textContent=t.name; select.appendChild(opt);
    });
    if(templates.length>0){
      select.value=templates[0].name;
      loadTemplate(templates[0]);
    } else {
      newTemplate();
    }
  });
}

function loadTemplate(t){
  qs('templateName').value=t.name;
  const tbody = qs('fields').querySelector('tbody');
  tbody.innerHTML='';
  for(const [k,v] of Object.entries(t.fields||{})){
    addFieldRow(k,v);
  }
}

function saveTemplate(){
  const name = qs('templateName').value.trim();
  if(!name) return;
  const rows = qs('fields').querySelectorAll('tbody tr');
  const fields={};
  rows.forEach(r=>{
    const k=r.querySelector('.field-name').value.trim();
    const v=r.querySelector('.field-value').value;
    if(k) fields[k]=v;
  });
  chrome.storage.sync.get({templates:[]}, ({templates})=>{
    const idx = templates.findIndex(t=>t.name===name);
    if(idx>=0) templates[idx].fields=fields; else templates.push({name,fields});
    chrome.storage.sync.set({templates}, ()=>loadTemplates());
  });
}

function deleteTemplate(){
  const name = qs('templateName').value.trim();
  if(!name) return;
  chrome.storage.sync.get({templates:[]}, ({templates})=>{
    const newT = templates.filter(t=>t.name!==name);
    chrome.storage.sync.set({templates:newT}, ()=>loadTemplates());
  });
}

function newTemplate(){
  qs('templateName').value='';
  qs('fields').querySelector('tbody').innerHTML='';
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadTemplates();
  qs('addField').addEventListener('click', ()=>addFieldRow());
  qs('save').addEventListener('click', saveTemplate);
  qs('delete').addEventListener('click', deleteTemplate);
  qs('new').addEventListener('click', newTemplate);
  qs('templateSelect').addEventListener('change', e=>{
    const name=e.target.value;
    chrome.storage.sync.get({templates:[]}, ({templates})=>{
      const t=templates.find(x=>x.name===name);
      if(t) loadTemplate(t);
    });
  });
});
