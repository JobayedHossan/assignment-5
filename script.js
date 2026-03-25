const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

// redirect if not logged in
if (window.location.pathname.includes('main.html') && !localStorage.getItem('user')) {
  window.location.href = 'index.html';
}

function login() {
  const u = username.value;
  const p = password.value;

  if (u === 'admin' && p === 'admin123') {
    localStorage.setItem('user', 'admin');
    window.location.href = 'main.html';
  } else {
    alert('Invalid credentials');
  }
}
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}


window.onload = () => {
  if (window.location.pathname.includes('main.html')) {
    loadIssues();
  }
};

function setTab(e, type) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab-active'));
  e.target.classList.add('tab-active');
  loadIssues(type);
}

async function loadIssues(type = 'all') {
  toggleLoader(true);
  const res = await fetch(API);
  const data = await res.json();
  let issues = data.data;

  if (type === 'open') issues = issues.filter(i => i.status === 'open');
  if (type === 'closed') issues = issues.filter(i => i.status === 'closed');

  displayIssues(issues);
  toggleLoader(false);
}

function displayIssues(issues) {
  issuesContainer.innerHTML = '';
  issueCount.innerText = `${issues.length} Issues`;

  issues.forEach(issue => {
    const div = document.createElement('div');
    console.log(issue.label, issue.labels);

    div.className = `
      bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition
      border-t-4 ${issue.status === 'open' ? 'border-green-500' : 'border-purple-500'}
      cursor-pointer
    `;

    const statusText = issue.status === 'open' ? 'Opened' : 'Closed';
    const date = new Date(issue.createdAt).toLocaleDateString();

    div.innerHTML = `
     <div class="flex justify-between items-start mb-1">

  <h2 class="font-semibold text-sm">
    ${issue.title}
  </h2>

<span class="
  text-[10px] px-2 py-[2px] rounded-full font-medium border w-[80px] text-center
  ${
    issue.priority?.toLowerCase() === 'high'
      ? 'bg-red-50 text-red-600 border-red-200'
      : issue.priority?.toLowerCase() === 'medium'
      ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
      : 'bg-green-50 text-green-600 border-green-200'
  }
">
  ${issue.priority}
</span>

</div>

      <p class="text-xs text-gray-500 mb-2 line-clamp-2">
        ${issue.description}
      </p>
           <!-- Labels -->
     <div class="flex gap-2 mb-2 flex-wrap">
  ${(() => {
    let labels = [];

    if (Array.isArray(issue.labels)) {
      labels = issue.labels;
    } else if (issue.label) {
      labels = [issue.label];
    }
return labels.map(label => {

  const l = label.toLowerCase().replace('_', ' ');

  if (l === 'bug') {
    return `<span class="flex items-center gap-1 text-[11px] font-semibold px-2 py-[3px] rounded-full !bg-red-100 !text-red-700 border border-blue-200">
               <span class="tracking-wide">BUG</span>
            </span>`;
  }

  if (l === 'help wanted') {
    return `<span class="flex items-center gap-1 text-[11px] font-semibold px-2 py-[3px] rounded-full !bg-orange-100 !text-orange-700 border border-gray-300">
               <span class="tracking-wide">HELP WANTED</span>
            </span>`;
  }

  if (l === 'enhancement') {
    return `<span class="flex items-center gap-1 text-[11px] font-semibold px-2 py-[3px] rounded-full !bg-green-200 !text-green-700 border border-green-200">
               <span class="tracking-wide">ENHENCEMENT</span>
            </span>`;
  }

  return '';
}).join('');
  })()}
</div>
     <p class="text-[11px] text-gray-400 mb-2">
  Opened by ${issue.author} · ${date}
</p>
      <div class="flex justify-between items-center text-xs text-gray-400">
        <span>${issue.author}</span>
      </div>
    `;

    div.onclick = () => openModal(issue);

    issuesContainer.appendChild(div);
  });
}

// / FIXED MODAL
function openModal(issue) {
  modalTitle.innerText = issue.title;
  const statusText = issue.status === 'open' ? 'Opened' : 'Closed';
  const date = new Date(issue.createdAt).toLocaleDateString();

  modalStatusBadge.innerText = statusText;

  modalStatusBadge.className = `
    px-2 py-0.5 rounded-full text-xs 
    ${issue.status === 'open'
      ? 'bg-green-100 text-green-600'
      : 'bg-purple-100 text-purple-600'}
  `;

  
  modalMeta.innerHTML = `
    · Opened by <span class="font-medium text-gray-700">${issue.author}</span>
    · ${date}
  `;


  modalType.innerText = issue.type || "Bug";
  modalLabel.innerText = issue.label || issue.labels?.[0] || '';

  modalDescription.innerText = issue.description;
  modalAuthor.innerText = issue.author;
  modalPriority.innerText = issue.priority;

  modal.showModal();
}

//  SEARCH 
async function searchIssues() {
  const q = searchInput.value.trim();

  if (!q) {
    loadIssues();
    return;
  }

  toggleLoader(true);

  const res = await fetch(`${API}/search?q=${q}`);
  const data = await res.json();

  displayIssues(data.data);

  toggleLoader(false);
}

function handleSearchClick() {
  searchIssues();
}

function toggleLoader(show) {
  loader.classList.toggle('hidden', !show);
}