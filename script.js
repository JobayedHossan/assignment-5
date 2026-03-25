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
