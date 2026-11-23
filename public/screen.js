const socket = io();
const $ = (id) => document.getElementById(id);
socket.on('connect', () => socket.emit('screen:join'));
fetch('/api/qr').then(r => r.json()).then(d => {
  if (d.dataUrl) $('dock-qr').src = d.dataUrl;
  if (d.url) $('dock-link').textContent = d.url.replace(/^https?:\/\//, '');
}).catch(() => {});
socket.on('classroom:update', (state) => {
  setCountdownState(state);
  renderStage(state);
  $('dock-count').textContent = state.totalVotes || 0;
  const round = state.round;
  const show = round && ['voting', 'results', 'explanation'].includes(state.phase);
  $('dock-bars').innerHTML = show ? round.options.map(o => {
    const n = (state.counts || {})[o.id] || 0;
    const pct = state.totalVotes ? Math.round(n / state.totalVotes * 100) : 0;
    return `<div class="live-row"><b>${o.id}</b><div class="live-track"><span style="width:${pct}%"></span></div><span>${pct}%</span></div>`;
  }).join('') : '';
  // En la explicación y el cierre el QR se minimiza para no tapar la diapositiva
  $('qr-dock').classList.toggle('compact', ['explanation', 'finished', 'results'].includes(state.phase));
});
