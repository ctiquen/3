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
  if (state.phase === 'intro') {
    $('stage').innerHTML = `<div class="stage-kicker">DINÁMICA DE CLASE</div><h1>¿Pobreza o falta de libertad?</h1><h2>El desafío de construir una sociedad con capacidades</h2><p>Ocho situaciones. Tres decisiones posibles. Una pregunta de fondo: ¿qué significa realmente superar la pobreza?</p><div class="stage-rule">Cuando el equipo esté listo, pulsa <b>Iniciar presentación</b>. Después abre cada votación.</div><div class="concept-label">Ruta de la clase</div><p class="tiny">Ingresos y capacidades → factores de conversión → salud y educación → desempleo → mortalidad → género y justicia → programas focalizados o universales → territorio y paz.</p>`;
    $('speaker-label').textContent = 'Equipo expositor'; $('slide-counter').textContent = 'Inicio';
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
    $('stage').innerHTML = `
      <div class="explanation-stage">
        <div class="stage-kicker">RONDA ${round.id}</div>
        <h1 class="question-heading">${round.insightTitle}</h1>
        <div class="explanation-block"><p>${round.explanation}</p></div>
        ${getChartMarkup(round.id)}
        <div class="teaching-box"><p>${round.teaching}</p></div>
        <div class="teaching-box"><p>${round.connection}</p></div>
        <p class="takeaway">${round.takeaway}</p>
        <div class="discussion-prompt">${round.discussion}</div>
      </div>
      ${progressMarkup(state.currentIndex, state.totalRounds)}
    `;
    mountCharts(round.id);
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

// ===== GRÁFICOS POR RONDA =====
let activeCharts = [];

function getChartMarkup(roundId) {
  switch (Number(roundId)) {
    case 4: // Desempleo -> Informalidad laboral
      return `
        <div style="width: 100%; max-width: 380px; margin: 18px auto;">
          <canvas id="chart-informalidad"></canvas>
        </div>`;
    case 7: // Programas -> Pobreza extrema México vs. Brasil
      return `
        <div style="width: 100%; max-width: 660px; margin: 18px auto;">
          <canvas id="chart-pobreza"></canvas>
        </div>`;
    case 8: // Territorio y paz -> KPIs + Plebiscito + Grupos armados
      return `
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 16px 0;">
          <div style="flex: 1; min-width: 150px; padding: 14px; border-radius: 10px; background: rgba(239, 68, 68, 0.12); text-align: center;">
            <div style="font-size: 1.7rem; font-weight: 800; color: #ef4444;">~8 M</div>
            <div style="font-size: 0.85rem;">Víctimas totales del conflicto</div>
          </div>
          <div style="flex: 1; min-width: 150px; padding: 14px; border-radius: 10px; background: rgba(245, 158, 11, 0.12); text-align: center;">
            <div style="font-size: 1.7rem; font-weight: 800; color: #f59e0b;">~7.5 M</div>
            <div style="font-size: 0.85rem;">Personas desplazadas</div>
          </div>
          <div style="flex: 1; min-width: 150px; padding: 14px; border-radius: 10px; background: rgba(100, 116, 139, 0.15); text-align: center;">
            <div style="font-size: 1.7rem; font-weight: 800; color: #475569;">+260,000</div>
            <div style="font-size: 0.85rem;">Personas asesinadas</div>
          </div>
        </div>
        <div style="display: flex; gap: 20px; flex-wrap: wrap; align-items: center; justify-content: center; margin: 18px 0;">
          <div style="flex: 1; min-width: 260px; max-width: 320px;">
            <canvas id="chart-plebiscito"></canvas>
          </div>
          <div style="flex: 2; min-width: 320px; max-width: 560px;">
            <canvas id="chart-grupos"></canvas>
          </div>
        </div>`;
    default:
      return '';
  }
}

function mountCharts(roundId) {
  // Limpia gráficos anteriores para evitar errores al cambiar de ronda
  activeCharts.forEach(c => c.destroy());
  activeCharts = [];

  if (typeof Chart === 'undefined') return;

  switch (Number(roundId)) {
    case 4: {
      const el = document.getElementById('chart-informalidad');
      if (!el) return;
      activeCharts.push(new Chart(el, {
        type: 'doughnut',
        data: {
          labels: ['Autoempleo / Microempresas (<5 emp.)', 'Resto del mercado laboral'],
          datasets: [{ data: [50, 50], backgroundColor: ['#f59e0b', '#cbd5e1'], borderWidth: 2 }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Informalidad laboral en América Latina (+50%)' },
            legend: { position: 'bottom' }
          }
        }
      }));
      break;
    }

    case 7: {
      const el = document.getElementById('chart-pobreza');
      if (!el) return;
      activeCharts.push(new Chart(el, {
        type: 'line',
        data: {
          labels: ['1981', '1990', '2000', '2008', '2011'],
          datasets: [
            {
              label: 'Brasil (%)',
              data: [24.8, 23.4, 13.05, 7.3, 6.1],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'México (%)',
              data: [13.48, 18.32, 15.2, 11.2, null],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Pobreza extrema: México vs. Brasil (1981–2011)' }
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: '% de población' } }
          }
        }
      }));
      break;
    }

    case 8: {
      const elPleb = document.getElementById('chart-plebiscito');
      if (elPleb) {
        activeCharts.push(new Chart(elPleb, {
          type: 'doughnut',
          data: {
            labels: ['Votaron (37.4%)', 'Abstención (62.6%)'],
            datasets: [{ data: [37.4, 62.6], backgroundColor: ['#3b82f6', '#e2e8f0'], borderWidth: 2 }]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: 'Plebiscito por la Paz (2016)' },
              legend: { position: 'bottom' }
            }
          }
        }));
      }

      const elGrupos = document.getElementById('chart-grupos');
      if (elGrupos) {
        activeCharts.push(new Chart(elGrupos, {
          type: 'bar',
          data: {
            labels: [
              'ELN (1,500–2,500)',
              'Clan del Golfo (AGC)',
              'Frente Oliver Sinisterra',
              'Frente 1° Armando Ríos',
              'EPL (Los Pelusos)',
              'Rastrojos (100–310)',
              'Caparrapos'
            ],
            datasets: [{
              label: 'Miembros estimados',
              data: [2000, 1600, 400, 400, 260, 205, 150],
              backgroundColor: '#ef4444',
              borderRadius: 4
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
              title: { display: true, text: 'Grupos armados activos en Colombia (estimado)' },
              legend: { display: false }
            },
            scales: {
              x: { beginAtZero: true, title: { display: true, text: 'Miembros' } }
            }
          }
        }));
      }
      break;
    }
  }
}



