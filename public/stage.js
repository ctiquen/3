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
