const STORAGE_KEY = 'resolute-sessions';
const form = document.getElementById('checkin-form');
const sessionsList = document.getElementById('sessions-list');
const clearBtn = document.getElementById('clear-btn');

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function renderSessions() {
  const sessions = loadSessions();

  if (!sessions.length) {
    sessionsList.innerHTML = '<li class="empty-state">No sessions logged yet. Add your first workout above.</li>';
    return;
  }

  sessionsList.innerHTML = sessions
    .map((session) => {
      const date = new Date(session.timestamp).toLocaleString();
      return `
        <li>
          <strong>${session.activity}</strong>
          <div class="meta">${session.minutes} min • ${date}</div>
          ${session.notes ? `<div>${session.notes}</div>` : ''}
        </li>
      `;
    })
    .join('');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const session = {
    activity: formData.get('activity').toString().trim(),
    minutes: Number(formData.get('minutes')),
    notes: formData.get('notes').toString().trim(),
    timestamp: new Date().toISOString()
  };

  const sessions = loadSessions();
  sessions.unshift(session);
  saveSessions(sessions.slice(0, 8));
  form.reset();
  renderSessions();
});

clearBtn.addEventListener('click', () => {
  saveSessions([]);
  renderSessions();
});

renderSessions();
