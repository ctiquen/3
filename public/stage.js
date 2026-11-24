// ===== EDITA AQUÍ LA PORTADA (solo se ve en la proyección /screen) =====
const PORTADA = {
  universidad: 'Universidad Nacional de Colombia',
  curso: 'Economía Política II',
  integrantes: ['Ana Bernadette Villavicencio Pauccar', 'Andrea Mamani Gallegos ', 'Berenice Faryde Gonzales Mollo ', 'Diego Alejandro Garnica Mamanché ', 'Ferney Esteban Díaz Rojas ', 'Noe Nicolay Paccha Salas', 'Lyna Camila Tique Nova'],
  autores: [
    'Amartya Sen, <i>Desarrollo y libertad</i> (cap. 4)',
    'Christian I. Becerril Velasco (2015)',
    'Nancy Fraser (2008)',
    'Ted Piccone, Brookings (2019)',
    'Acuerdo Final de Paz (2016)'
  ]
};
// ======================================================================

function progressMarkup(index, total) {
  return `<div class="slide-progress">${Array.from({length:total || 8}, (_, i) => `<span class="${i <= index ? 'active' : ''}"></span>`).join('')}</div>`;
}
function renderStage(state) {
  const round = state.round;
  if (state.phase === 'intro' && document.body.classList.contains('screen-body')) {
    $('stage').innerHTML = `<div class="stage-kicker">${PORTADA.universidad.toUpperCase()}</div><div class="concept-label" style="margin-top:0">${PORTADA.curso}</div><h1>¿Pobreza o falta de libertad?</h1><h2>El desafío de construir una sociedad con capacidades</h2><p>Ocho situaciones. Tres decisiones posibles. Una pregunta de fondo: ¿qué significa realmente superar la pobreza?</p><div class="concept-label">Basada en</div><p class="tiny">${PORTADA.autores.join(' · ')}</p><div class="concept-label">Presentan</div><p><b>${PORTADA.integrantes.join(' · ')}</b></p>`;
    return;
  }
  if (state.phase === 'intro' && document.body.classList.contains('screen-body')) {
    $('stage').innerHTML = `
      <div class="stage-kicker">${PORTADA.universidad.toUpperCase()}</div>
      <div class="concept-label" style="margin-top:0">${PORTADA.curso}</div>
      <h1>¿Pobreza o falta de libertad?</h1>
      <h2>El desafío de construir una sociedad con capacidades</h2>
      <div class="portada-lead">
        <p>Ocho situaciones. Tres decisiones posibles. Una pregunta de fondo: ¿qué significa realmente superar la pobreza?</p>
      </div>
      <div class="concept-label">Basada en</div>
      <div class="portada-box">
        <p class="tiny">${PORTADA.autores.join(' · ')}</p>
      </div>
      <div class="concept-label">Presentan</div>
      <p><b>${PORTADA.integrantes.map(n => n.trim()).join(' · ')}</b></p>
    `;
    return;
  }
  if (state.phase === 'finished') {
    $('stage').innerHTML = `<div class="stage-kicker">SÍNTESIS FINAL</div><h1>La pobreza limita libertades reales.</h1><h2>¿Qué debemos mirar para comprenderla y enfrentarla?</h2><div class="explanation-block"><p><b>1. Recursos:</b> ¿con qué ingresos y bienes cuentan las personas?</p></div><div class="explanation-block"><p><b>2. Conversión:</b> ¿qué condiciones personales, sociales e institucionales permiten transformar esos recursos en oportunidades?</p></div><div class="explanation-block"><p><b>3. Justicia y voz:</b> ¿quién recibe, quién decide, quién es reconocido y quién participa?</p></div><p class="takeaway">Desarrollar es ampliar las libertades reales de las personas para vivir la vida que valoran.</p><div class="discussion-prompt"><b>Pregunta de cierre:</b> Después de las ocho rondas, ¿qué decisión cambiarían en la forma de diseñar una política contra la pobreza?</div><div class="concept-label">Referencias</div><div class="teaching-box refs"><p>Sen, A. <i>Desarrollo y libertad</i>, cap. 4: «La pobreza como privación de capacidades».</p><p>Becerril Velasco, C. I. (2015). El papel del Estado en el alivio a la pobreza en la era neoliberal. Una aproximación teórica. <i>Revista Mexicana de Ciencias Políticas y Sociales, 60</i>(225). https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0185-19182015000300369</p><p>Fraser, N. (2008). La justicia social en la era de la política de identidad: redistribución, reconocimiento y participación. <i>Revista de Trabajo, 4</i>(6), 83–99. (Selección del cap. 1 de Fraser y Honneth, <i>¿Redistribución o reconocimiento?</i>, Morata, 2006).</p><p>Piccone, T. (2019, julio). <i>Peace with Justice: The Colombian Experience with Transitional Justice</i>. Foreign Policy at Brookings.</p><p>Gobierno de Colombia y FARC-EP (2016). <i>Acuerdo Final para la terminación del conflicto y la construcción de una paz estable y duradera</i>.</p></div>`;
    $('speaker-label').textContent = 'Cierre colectivo'; $('slide-counter').textContent = 'Conclusión';
    return;
  }
  if (!round) return;
  $('speaker-label').textContent = `${round.speaker} · ${round.time}`;
  $('slide-counter').textContent = `Diapositiva ${state.currentIndex + 1} / ${state.totalRounds}`;
  const options = round.options.map(o => `<div class="option-card"><span class="option-letter">${o.id}</span><div><strong>${o.label}</strong></div></div>`).join('');
  if (state.phase === 'question' || state.phase === 'voting') {
    const isScreen = document.body.classList.contains('screen-body');
    const kicker = isScreen
      ? `RONDA ${round.id}`
      : `RONDA ${round.id} · ${round.speaker.toUpperCase()}`;
    const rule = state.phase === 'voting'
      ? '<div class="stage-rule"><b>VOTACIÓN ABIERTA:</b> el público puede elegir o cambiar su respuesta desde el celular.</div>'
      : (isScreen ? '' : '<div class="stage-rule">Lee el escenario y las opciones. La votación todavía no está abierta.</div>');

    $('stage').innerHTML = `<div class="stage-kicker">${kicker}</div><div class="scenario-label">El caso</div><p class="scenario-text">${round.scenario}</p><h2 class="question-heading">${round.question}</h2><div class="option-grid">${options}</div>${rule}${progressMarkup(state.currentIndex, state.totalRounds)}`;
  } else if (state.phase === 'explanation') {
    $('stage').innerHTML = `<div class="explanation-stage"><div class="stage-kicker">RONDA ${round.id}</div><h1 class="question-heading">${round.insightTitle}</h1><div class="explanation-block"><p>${round.explanation}</p></div><div class="teaching-box"><p>${round.teaching}</p></div><div class="teaching-box"><p>${round.connection}</p></div><p class="takeaway">${round.takeaway}</p><div class="discussion-prompt">${round.discussion}</div></div>${progressMarkup(state.currentIndex, state.totalRounds)}`;
  }
}

let __cd = null, __off = 0;
function setCountdownState(state) {
  __cd = state && state.phase === 'voting' ? state.endsAt : null;
  __off = ((state && state.now) || Date.now()) - Date.now();
}
setInterval(() => {
  document.querySelectorAll('.js-countdown').forEach((el) => {
    if (!__cd) { el.textContent = ''; return; }
    const s = Math.max(0, Math.ceil((__cd - (Date.now() + __off)) / 1000));
    el.textContent = '\u23f1 ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  });
}, 250);

// =====================================================================
// GRÁFICOS (Chart.js)  ·  Este bloque va al FINAL de stage.js
// =====================================================================
const CHART_COLORS = { ink: '#432818', muted: '#7F5539', grid: '#E8DCCF' };

// Cada opción conserva su color en todos los gráficos (A vino, B dorado, C arena).
const OPTION_STYLE = {
  A: { bg: '#6F1D1B', border: '#6F1D1B' },
  B: { bg: '#BB9457', border: '#BB9457' },
  C: { bg: '#E6CCB2', border: '#7F5539' }
};

// Gráficos con datos de las lecturas. La clave es el id de la ronda.
// Para añadir otro, copia un bloque y cambia el número y los datos.
const ROUND_CHARTS = {
  5: {
    title: 'Desnutrición infantil: rango citado por Sen (% de niños)',
    kind: 'range',
    labels: ['India', 'África Subsahariana'],
    ranges: [[40, 60], [20, 40]],
    suffix: '%',
    source: 'Cifras de la discusión de Sen (cap. 4); no son estadísticas actuales.'
  },
  8: {
    title: 'Restitución de tierras: casos finalizados vs. restitución efectiva',
    kind: 'bars',
    labels: ['Casos finalizados', 'Con restitución efectiva'],
    values: [54000, 10000],
    valueLabels: ['≈ 54.000', 'menos de 10.000'],
    source: 'Piccone (2019), Brookings. Cifras hasta 2019.'
  }
};

let activeCharts = [];
let lastChartKey = '';

const chartsReady = () => typeof Chart !== 'undefined';
const chartFont = () => (document.body.classList.contains('screen-body') ? 18 : 13);

function setupChartDefaults() {
  Chart.defaults.font.family = "'DM Sans', Arial, sans-serif";
  Chart.defaults.font.size = chartFont();
  Chart.defaults.color = CHART_COLORS.ink;
}
function destroyCharts() {
  activeCharts.forEach((c) => c.destroy());
  activeCharts = [];
}

// Escribe un texto al final de cada barra horizontal (ej. "12 votos · 40%").
function valueLabelsPlugin(labels) {
  const size = chartFont();
  return {
    id: 'valueLabels',
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      ctx.save();
      ctx.font = `700 ${size}px Manrope, 'DM Sans', sans-serif`;
      ctx.fillStyle = CHART_COLORS.ink;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      chart.getDatasetMeta(0).data.forEach((bar, i) => {
        if (labels[i]) ctx.fillText(labels[i], bar.x + 10, bar.y);
      });
      ctx.restore();
    }
  };
}

// ---------- 1) Resultados de cada ronda (diapositiva propia) ----------
function resultsMarkup(state) {
  const round = state.round;
  const counts = state.counts || {};
  const total = state.totalVotes || 0;
  const cards = round.options.map((o) => {
    const n = counts[o.id] || 0;
    const pct = total ? Math.round((n / total) * 100) : 0;
    const st = OPTION_STYLE[o.id] || OPTION_STYLE.A;
    return `<div class="result-item"><div class="result-top"><strong><i class="swatch" style="background:${st.bg};border-color:${st.border}"></i>${o.id} · ${o.label}</strong><span class="result-percent">${pct}%</span></div><div class="result-consequence">${o.consequence}</div></div>`;
  }).join('');
  const chartBox = chartsReady()
    ? '<div class="chart-box"><canvas id="vote-chart"></canvas></div>'
    : '<p class="chart-source">No se pudo cargar la librería de gráficos. Revisa la conexión a internet.</p>';
  return `<div class="results-stage"><div class="stage-kicker">RESULTADOS · RONDA ${round.id}</div><h2 class="question-heading">Así votó el grupo</h2><p class="chart-sub">${total} voto${total === 1 ? '' : 's'} · ${round.question}</p>${chartBox}<div class="result-grid">${cards}</div></div>${progressMarkup(state.currentIndex, state.totalRounds)}`;
}
function drawResultsChart(state) {
  const canvas = $('vote-chart');
  if (!canvas || !chartsReady()) return;
  setupChartDefaults();
  const counts = state.counts || {};
  const total = state.totalVotes || 0;
  const ids = state.round.options.map((o) => o.id);
  const data = ids.map((id) => counts[id] || 0);
  const labels = data.map((n) => `${n} voto${n === 1 ? '' : 's'} · ${total ? Math.round((n / total) * 100) : 0}%`);
  activeCharts.push(new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ids.map((id) => 'Opción ' + id),
      datasets: [{
        data,
        backgroundColor: ids.map((id) => (OPTION_STYLE[id] || OPTION_STYLE.A).bg),
        borderColor: ids.map((id) => (OPTION_STYLE[id] || OPTION_STYLE.A).border),
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      layout: { padding: { right: chartFont() * 9 } },
      scales: {
        x: { beginAtZero: true, suggestedMax: Math.max(3, ...data), ticks: { precision: 0 }, grid: { color: CHART_COLORS.grid } },
        y: { grid: { display: false } }
      },
      plugins: { legend: { display: false }, tooltip: { enabled: false } }
    },
    plugins: [valueLabelsPlugin(labels)]
  }));
}

// ---------- 2) Gráficos con datos de las lecturas (rondas 5 y 8) ----------
function dataChartMarkup(spec) {
  return `<div class="chart-card"><div class="concept-label" style="margin-top:0">${spec.title}</div><div class="chart-box chart-box-sm"><canvas id="data-chart"></canvas></div><p class="chart-source">${spec.source}</p></div>`;
}
function drawDataChart(spec, animate) {
  const canvas = $('data-chart');
  if (!canvas || !chartsReady()) return;
  setupChartDefaults();
  const isRange = spec.kind === 'range';
  const labels = isRange
    ? spec.ranges.map((r) => `${r[0]}–${r[1]}${spec.suffix || ''}`)
    : spec.valueLabels;
  activeCharts.push(new Chart(canvas, {
    type: 'bar',
    data: {
      labels: spec.labels,
      datasets: [{
        data: isRange ? spec.ranges : spec.values,
        backgroundColor: ['#6F1D1B', '#BB9457'],
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: animate ? { duration: 700 } : false,
      layout: { padding: { right: chartFont() * 8 } },
      scales: {
        x: {
          beginAtZero: true,
          max: isRange ? 100 : undefined,
          suggestedMax: isRange ? undefined : 60000,
          grid: { color: CHART_COLORS.grid },
          ticks: { callback: (v) => (isRange ? v + '%' : Number(v).toLocaleString('es-CO')) }
        },
        y: { grid: { display: false } }
      },
      plugins: { legend: { display: false }, tooltip: { enabled: false } }
    },
    plugins: [valueLabelsPlugin(labels)]
  }));
}

// ---------- 3) Resumen final: cómo votó el grupo en las 8 rondas ----------
// Necesita state.history (ver los 3 cambios en server.js).
function summaryMarkup() {
  return '<div class="chart-card"><div class="concept-label" style="margin-top:0">Cómo votó el grupo, ronda por ronda (% de votos)</div><div class="chart-box chart-box-sm"><canvas id="summary-chart"></canvas></div><p class="chart-source">R1 a R8 son las rondas. Cada columna suma el 100 % de los votos de esa ronda.</p></div>';
}
function drawSummaryChart(state, animate) {
  const canvas = $('summary-chart');
  if (!canvas || !chartsReady()) return;
  setupChartDefaults();
  const history = state.history || {};
  const ids = ['A', 'B', 'C'];
  const labels = [];
  const series = { A: [], B: [], C: [] };
  for (let i = 0; i < state.totalRounds; i++) {
    labels.push('R' + (i + 1));
    const h = history[i];
    const total = h ? (h.A || 0) + (h.B || 0) + (h.C || 0) : 0;
    ids.forEach((id) => series[id].push(total ? ((h[id] || 0) / total) * 100 : null));
  }
  activeCharts.push(new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: ids.map((id) => ({
        label: 'Opción ' + id,
        data: series[id],
        backgroundColor: OPTION_STYLE[id].bg,
        borderColor: OPTION_STYLE[id].border,
        borderWidth: 1
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: animate ? { duration: 700 } : false,
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, min: 0, max: 100, ticks: { stepSize: 25, callback: (v) => v + '%' }, grid: { color: CHART_COLORS.grid } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 14, boxHeight: 14 } },
        tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${Math.round(c.parsed.y)}%` } }
      }
    }
  }));
}

// ---------- Punto de entrada: reemplaza al renderStage original ----------
function renderStage(state) {
  const stage = $('stage');
  const round = state.round;
  const key = `${state.phase}:${state.currentIndex}`;
  const animate = key !== lastChartKey;
  lastChartKey = key;

  // Resultados: diapositiva propia, se dibuja una sola vez por ronda.
  if (state.phase === 'results' && round) {
    if (stage.dataset.key === key) return;
    destroyCharts();
    renderStageBase(state); // actualiza "Diapositiva x / y" y el orador
    stage.innerHTML = resultsMarkup(state);
    stage.dataset.key = key;
    drawResultsChart(state);
    return;
  }

  stage.dataset.key = '';
  destroyCharts();
  renderStageBase(state);
  if (!chartsReady()) return;

  if (state.phase === 'explanation' && round && ROUND_CHARTS[round.id]) {
    const block = stage.querySelector('.explanation-block');
    if (block) {
      const wrap = document.createElement('div');
      wrap.className = 'explanation-split';
      block.parentNode.insertBefore(wrap, block);
      wrap.appendChild(block);
      wrap.insertAdjacentHTML('beforeend', dataChartMarkup(ROUND_CHARTS[round.id]));
      drawDataChart(ROUND_CHARTS[round.id], animate);
    }
  } else if (state.phase === 'finished' && state.history && Object.keys(state.history).length) {
    const title = stage.querySelector('h2');
    if (title) {
      title.insertAdjacentHTML('afterend', summaryMarkup());
      drawSummaryChart(state, animate);
    }
  }
}
