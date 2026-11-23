const socket = io();
const $ = (id) => document.getElementById(id);
let latestState = null;
let participantUrl = '';

const phaseNames = {
  intro: 'PANTALLA INICIAL', question: 'SITUACIÓN Y DECISIÓN', voting: 'VOTACIÓN ABIERTA',
  results: 'RESULTADOS DEL GRUPO', explanation: 'EXPLICACIÓN Y CONCEPTO', finished: 'CIERRE DE LA ACTIVIDAD'
};

$('login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  $('login-error').textContent = 'Verificando…';
  socket.emit('presenter:login', $('pin-input').value);
});
socket.on('presenter:auth', (result) => {
  if (!result.ok) {
    $('login-error').textContent = result.message || 'No se pudo iniciar sesión.';
    return;
  }
  $('login-screen').classList.add('hidden');
  $('app').classList.remove('hidden');
  loadQr();
});
socket.on('connect', () => {
  $('connection-label').textContent = 'Conectado';
  $('connection-label').classList.add('connected');
});
socket.on('disconnect', () => {
  $('connection-label').textContent = 'Sin conexión';
  $('connection-label').classList.remove('connected');
});
socket.on('notice', (notice) => {
  if (notice && notice.message) $('control-hint').textContent = notice.message;
});
socket.on('classroom:update', (state) => {
  latestState = state;
  setCountdownState(state);
  render(state);
});

function loadQr() {
  fetch('/api/config').then(r => r.json()).then(config => {
    participantUrl = config.participantUrl;
    $('room-label').textContent = config.roomCode;
    $('qr-room').textContent = config.roomCode;
    $('participant-link').href = participantUrl;
    $('participant-link').textContent = participantUrl;
  }).catch(() => { $('qr-warning').textContent = 'No se pudo cargar la dirección de acceso.'; });
  fetch('/api/qr').then(r => r.json()).then(data => {
    if (data.dataUrl) $('qr-image').src = data.dataUrl;
    if (data.url) {
      participantUrl = data.url;
      $('participant-link').href = data.url;
      $('participant-link').textContent = data.url;
    }
  }).catch(() => { $('qr-warning').textContent = 'No se pudo generar el QR. Comparte el enlace que aparece aquí.'; });
}
$('copy-link').addEventListener('click', async () => {
  if (!participantUrl) return;
  try {
    await navigator.clipboard.writeText(participantUrl);
    $('copy-link').textContent = '¡Copiado!';
    setTimeout(() => $('copy-link').textContent = 'Copiar enlace', 1500);
  } catch (_error) {
    $('qr-warning').textContent = 'Selecciona y copia el enlace manualmente.';
  }
});

$('start-btn').addEventListener('click', () => socket.emit('control:start'));
$('open-btn').addEventListener('click', () => socket.emit('control:open-vote', Number($('duration-select').value)));
$('close-btn').addEventListener('click', () => socket.emit('control:close-vote'));
$('explain-btn').addEventListener('click', () => socket.emit('control:show-explanation'));
$('next-btn').addEventListener('click', () => socket.emit('control:next'));
$('restart-btn').addEventListener('click', () => {
  if (confirm('¿Reiniciar toda la actividad y borrar los votos de las ocho rondas?')) socket.emit('control:restart');
});

function render(state) {
  $('phase-label').textContent = phaseNames[state.phase] || 'ACTIVIDAD';
  $('round-label').textContent = state.round ? `Ronda ${state.currentIndex + 1} de ${state.totalRounds}` : 'Cierre';
  $('online-count').textContent = state.onlineParticipants ?? 0;
  $('vote-total').textContent = state.totalVotes ?? 0;
  $('room-label').textContent = state.roomCode;
  updateControls(state);
  renderStage(state);
  renderMonitor(state);
  renderSpeakerNotes(state);
}

function updateControls(state) {
  $('start-btn').disabled = state.phase !== 'intro';
  $('open-btn').disabled = state.phase !== 'question';
  $('close-btn').disabled = state.phase !== 'voting';
  $('explain-btn').disabled = state.phase !== 'results';
  $('next-btn').disabled = state.phase !== 'explanation';
  $('next-btn').textContent = state.currentIndex === state.totalRounds - 1 ? 'Terminar y ver cierre →' : 'Siguiente ronda →';
  const hints = {
    intro: 'Inicia la presentación. El público verá una pantalla de espera.',
    question: 'Presenta el caso y las tres opciones. Abre la votación cuando la clase esté lista.',
    voting: 'La votación está abierta. Observa cómo cambian los resultados en tiempo real y ciérrala cuando quieras.',
    results: 'Los resultados ya son visibles. Comenta la distribución y muestra después la explicación.',
    explanation: 'Explica el concepto y la relación con las lecturas. Avanza cuando termine la intervención.',
    finished: 'La actividad terminó. Puedes reiniciarla para otra clase.'
  };
  $('control-hint').textContent = hints[state.phase] || '';
}

function renderMonitor(state) {
  const round = state.round;
  if (!round) {
    $('live-bars').innerHTML = '<p class="muted tiny">La actividad terminó.</p>';
    return;
  }
  if (!['voting','results','explanation'].includes(state.phase)) {
    $('live-bars').innerHTML = '<p class="muted tiny">Las barras aparecerán cuando se abra la votación.</p>';
    return;
  }
  const counts = state.counts || {A:0,B:0,C:0};
  const total = state.totalVotes || 0;
  $('live-bars').innerHTML = round.options.map(o => {
    const n = counts[o.id] || 0; const pct = total ? Math.round(n / total * 100) : 0;
    return `<div class="live-row"><b>${o.id}</b><div class="live-track"><span style="width:${pct}%"></span></div><span>${n} · ${pct}%</span></div>`;
  }).join('');
}
function renderSpeakerNotes(state) {
  const round = state.round;
  if (!round) {
    $('speaker-notes').innerHTML = '<strong>Cierre colectivo.</strong><br>Retomen la idea central: el desarrollo consiste en ampliar las libertades reales y no solo aumentar el ingreso.';
    $('time-chip').textContent = '3 minutos · reflexión final';
    return;
  }
  $('speaker-notes').innerHTML = `<strong>${round.speaker}:</strong> ${round.teaching}<br><br><strong>Conexión:</strong> ${round.connection}`;
  $('time-chip').textContent = `${round.time} · ${round.speaker}`;
}
