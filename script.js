const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const colors = ['#ff4d4d', '#4da6ff', '#4dff88', '#ffd24d', '#b84dff'];
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(); }
  
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 12 + 8;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  
  update() {
    this.speedX += (Math.random() - 0.5) * 0.01;
    this.speedY += (Math.random() - 0.5) * 0.01;
    const maxSpeed = 0.7;
    this.speedX = Math.max(Math.min(this.speedX, maxSpeed), -maxSpeed);
    this.speedY = Math.max(Math.min(this.speedY, maxSpeed), -maxSpeed);
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function initParticles() {
  particles = [];
  const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

function smoothScroll(target, duration = 600) {
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY;
  const distance = end - start;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress; // easeInOutQuad
    window.scrollTo(0, start + distance * ease);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const sectionName = btn.dataset.section;
    const section = document.getElementById(sectionName);
    if (section) smoothScroll(section);
  });
});

// Scroll down button
document.getElementById('scroll-btn').addEventListener('click', () => {
  const section = document.getElementById('projects');
  if (section) smoothScroll(section);
});

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), index * 100);
  });
}, observerOptions);
document.querySelectorAll('.project-card').forEach(card => observer.observe(card));

const mcStatusEl = document.getElementById('mc-status');
const serverAddress = 'mc.powboy1.xyz';
async function fetchMcStatus() {
  try {
    const res = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(serverAddress)}`);
    const data = await res.json();
    if (data && data.online) {
      const players = data.players?.online || 0;
      const maxPlayers = data.players?.max || 0;
      const version = data.version || 'Unknown';
      const motd = data.motd?.clean?.join(' ') || '';
      mcStatusEl.innerHTML = `
        <div class="mc-status-content">
          <div class="mc-online">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
            Online
          </div>
          <div class="mc-details">
            <div><span>Version:</span><strong>${version}</strong></div>
            <div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <strong>${players} / ${maxPlayers}</strong>
            </div>
          </div>
          ${motd ? `<p class="mc-motd">${motd}</p>` : ''}
        </div>
      `;
    } else {
      mcStatusEl.innerHTML = `
        <div class="mc-offline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
          Server appears offline or not found
        </div>
      `;
    }
  } catch (error) {
    mcStatusEl.innerHTML = `
      <div class="mc-offline">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        Error checking server status
      </div>
    `;
  }
}
fetchMcStatus();

function showToast(message, type = 'success') {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2000);
}

async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    const originalSvg = button.querySelector('svg').outerHTML;
    button.querySelector('svg').outerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`;
    button.classList.add('copied');
    showToast('Copied to clipboard!');
    setTimeout(() => {
      button.querySelector('svg').outerHTML = originalSvg;
      button.classList.remove('copied');
    }, 2000);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); showToast('Copied to clipboard!'); }
    catch { showToast('Failed to copy', 'error'); }
    finally { document.body.removeChild(textarea); }
  }
}

document.getElementById('copy-java').addEventListener('click', function() { copyToClipboard(this.dataset.copy, this); });
document.getElementById('copy-bedrock').addEventListener('click', function() { copyToClipboard(this.dataset.copy, this); });
document.getElementById('signup-join').addEventListener('click', function() {
  const url = this.dataset.url || 'https://docs.google.com/forms/d/e/1FAIpQLSdNF0feOxmMkKqCt-rXoR8ngX-vqP1ACzsqP93aNWh5GJ9bTw/viewform?usp=sharing&ouid=106407334644810506310';
  window.open(url, '_blank', 'noopener');
});

window.addEventListener('load', () => {
  setTimeout(() => smoothScroll(document.body, 500), 50);
});
