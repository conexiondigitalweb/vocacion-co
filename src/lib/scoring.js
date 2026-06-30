export function calcularPerfil(respuestas) {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

  // Holland directo (peso alto) — P1-P4
  // E y C reciben peso reducido en q1/q3 para evitar sobrepeso por respuestas "neutras"
  const hollandMap = { q1: 3, q2: 2, q3: 3, q4: 2 }
  const pesoReducido = { E: 2, C: 2 }
  Object.entries(hollandMap).forEach(([q, peso]) => {
    const tipo = respuestas[q]
    if (!tipo) return
    const pesoFinal = (peso === 3 && pesoReducido[tipo]) ? pesoReducido[tipo] : peso
    scores[tipo] += pesoFinal
  })

  // Inteligencias múltiples → Holland (peso medio)
  const intelToHolland = {
    LG: ['A', 'S'], LM: ['I', 'C'], MU: ['A'], ES: ['A', 'R'],
    CK: ['R', 'S'], IN: ['S', 'E'], IP: ['S', 'A'], NA: ['R', 'I'],
    BI: ['I'], SC: ['S', 'I'], AR: ['A'], EF: ['R', 'S'],
    IN_idioma: ['A', 'S'], TI: ['I', 'R'],
  }

  const q5 = respuestas.q5 || []
  q5.forEach(v => {
    ;(intelToHolland[v] || []).forEach(t => { scores[t] += 2 })
  })
  if (respuestas.q6 && intelToHolland[respuestas.q6]) {
    intelToHolland[respuestas.q6].forEach(t => { scores[t] += 1.5 })
  }
  if (respuestas.q7 && intelToHolland[respuestas.q7]) {
    intelToHolland[respuestas.q7].forEach(t => { scores[t] += 1 })
  }

  // Valores → Holland (rebalanceado)
  // DI (dinero/estabilidad) → C (convencional, no E): trabajos estables tienden a ser estructurados
  // AU (autonomía) → E pero peso reducido
  // RS (reconocimiento) → compartido E+I, no solo E
  // CR (creatividad) → A (artístico, no E)
  const valoresMap = {
    DI: 'C',  // estabilidad = estructura, no emprendimiento
    AU: 'E',  // autonomía sí apunta a E, pero peso reducido abajo
    IM: 'S',
    CR: 'A',  // creatividad = artístico, no emprendedor
    CO: 'I',
    RS: 'E',
  }
  const valoresPeso = {
    DI: 1.5, AU: 1.5, IM: 2, CR: 2, CO: 2, RS: 1.5,
  }
  if (respuestas.q8 && valoresMap[respuestas.q8]) {
    scores[valoresMap[respuestas.q8]] += valoresPeso[respuestas.q8]
  }

  // q10 valores/frases directas
  const q10Map = {
    IM: 'S', CR: 'A', CO: 'I', E: 'E', DI: 'C', AU: 'E',
  }
  if (respuestas.q10 && q10Map[respuestas.q10]) {
    scores[q10Map[respuestas.q10]] += 1.5
  }

  const ambienteMap = { OF: 'C', CA: 'R', SA: 'S', REM: 'A', NEG: 'E', CRE: 'A', EDU: 'S' }
  if (respuestas.q9 && ambienteMap[respuestas.q9]) scores[ambienteMap[respuestas.q9]] += 1.5

  // Likert (P14) — clave q14 (no 'likert')
  const likertMap = ['A', 'I', 'S', 'A', 'E', 'R', 'A', 'C']
  const likert = respuestas.q14 || []
  likert.forEach((v, i) => {
    if (likertMap[i]) scores[likertMap[i]] += (v || 0) * 0.8
  })

  // Normalizar a porcentajes
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1
  const perfil = {}
  Object.entries(scores).forEach(([k, v]) => {
    perfil[k] = Math.round((v / total) * 100)
  })

  const ordenado = Object.entries(perfil).sort((a, b) => b[1] - a[1])
  const top2 = ordenado.slice(0, 2).map(e => e[0])

  return { scores, perfil, top2 }
}

export function matchCarreras(perfil, respuestas, carrerasDB) {
  const { top2 } = perfil
  const modPref = respuestas.q11 || 'U'
  const econ = respuestas.q13 || 'MIX'
  const q5 = respuestas.q5 || []
  const q8 = respuestas.q8
  const q9 = respuestas.q9
  const modo = respuestas.q0 || 'AMBAS'  // pregunta introductoria

  return carrerasDB
    .map(c => {
      let score = 0

      // Filtro por modo de exploración
      if (modo === 'TRAD' && c.emergente) score -= 5
      if (modo === 'EMER' && !c.emergente) score -= 3
      // AMBAS: sin penalización

      // Match Holland
      top2.forEach((t, i) => {
        if (c.tipos.includes(t)) score += 4 - i * 1.5
      })

      // Match inteligencias
      q5.forEach(v => { if (c.inteligencias.includes(v)) score += 2 })
      if (respuestas.q6 && c.inteligencias.includes(respuestas.q6)) score += 1

      // Match valores
      if (q8 && c.valores.includes(q8)) score += 2
      if (q9 && c.ambientes.includes(q9)) score += 1.5

      // Match modalidad
      if (c.modalidad === modPref) score += 3
      if (econ === 'PUB' && ['T', 'TEC'].includes(c.modalidad)) score += 2

      // Boost carreras emergentes para EMER
      if (modo === 'EMER' && c.emergente) score += 4

      // Penalización por saturación: solo cuando el match es débil
      if (c.saturacion === 'alta' && score < 8) score -= 2

      return { ...c, matchScore: score }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

export const HOLLAND_NOMBRES = {
  R: 'Realista',
  I: 'Investigador',
  A: 'Artístico',
  S: 'Social',
  E: 'Emprendedor',
  C: 'Convencional',
}

export const HOLLAND_DESCRIPCIONES = {
  R: 'Práctico, concreto y orientado a resultados tangibles. Disfrutas trabajar con tus manos y con objetos físicos.',
  I: 'Analítico, curioso y apasionado por entender el mundo. Disfrutas la investigación y los problemas complejos.',
  A: 'Creativo, expresivo e innovador. Disfrutas crear, diseñar y dar vida a ideas originales.',
  S: 'Empático, comunicativo y orientado a las personas. Disfrutas ayudar, enseñar y conectar con otros.',
  E: 'Ambicioso, persuasivo y líder natural. Disfrutas emprender, dirigir y convencer.',
  C: 'Organizado, metódico y orientado al detalle. Disfrutas los sistemas claros y los procesos bien definidos.',
}

export const COMBOS_TOP2 = {
  RI: 'Práctico y analítico — ideal para carreras técnicas que combinan habilidad manual con pensamiento científico.',
  RA: 'Práctico y creativo — un perfil ideal para diseño industrial, arquitectura o artes aplicadas.',
  RS: 'Práctico y con vocación de servicio — te destacas en salud física, deportes o trabajo comunitario.',
  RE: 'Haces y líderas — emprendimientos técnicos, construcción o industria son tu terreno.',
  RC: 'Metódico y práctico — ingeniería, logística o gestión de operaciones son ideales para ti.',
  IR: 'Investigador con habilidades prácticas — ciencias aplicadas, laboratorios e ingeniería son tu zona.',
  IA: 'Analítico y creativo — diseño UX, arquitectura, biología o arte digital son tu zona.',
  IS: 'Científico con vocación social — medicina, psicología, educación o trabajo social son tu terreno.',
  IE: 'Analítico y emprendedor — tecnología, startups, finanzas o ciencias empresariales son ideales.',
  IC: 'Investigador y sistemático — sistemas de información, contabilidad o ciencias exactas son tu área.',
  AI: 'Creativo con mente analítica — diseño, arquitectura, cine o tecnología creativa son tu zona.',
  AR: 'Artístico con habilidades prácticas — artes aplicadas, diseño industrial o producción audiovisual.',
  AS: 'Creativo con vocación social — comunicación, educación artística o trabajo comunitario te llenarán.',
  AE: 'Creativo y emprendedor — comunicación, marketing, moda o economía creativa son tu mundo.',
  AC: 'Artístico y organizado — producción, dirección de arte o gestión cultural te quedan perfectos.',
  SI: 'Social e investigador — psicología, ciencias sociales, medicina o trabajo social son tu vocación.',
  SR: 'Social y práctico — fisioterapia, enfermería, deporte o trabajo comunitario son ideales para ti.',
  SA: 'Social y creativo — comunicación, educación o artes escénicas te van a llenar de sentido.',
  SE: 'Social y líder — derecho, administración, política o gestión de talento humano son tu camino.',
  SC: 'Social y organizado — trabajo social, recursos humanos o administración pública te encajan bien.',
  EI: 'Emprendedor analítico — tecnología, finanzas, consultoría o ciencias empresariales son tu terreno.',
  ER: 'Emprendedor práctico — industria, construcción, agronegocio o tecnología operativa te van bien.',
  EA: 'Emprendedor creativo — marketing, medios, moda o economía creativa son tu mundo.',
  ES: 'Líder con vocación social — derecho, administración, política o salud pública son ideales.',
  EC: 'Emprendedor metódico — finanzas, administración, contaduría o gestión empresarial son tu área.',
  CI: 'Sistemático e investigador — tecnología, ciencias exactas, estadística o contabilidad te quedan.',
  CR: 'Metódico y práctico — ingeniería, logística, operaciones o administración son ideales para ti.',
  CA: 'Organizado y creativo — diseño, producción o gestión de proyectos creativos te encajan bien.',
  CS: 'Sistemático y social — recursos humanos, trabajo social o salud pública son tu área.',
  CE: 'Metódico y emprendedor — administración, finanzas, contaduría o gestión empresarial son tu ruta.',
}
