# PROMPT MAESTRO — vocacion.co
# Orientador vocacional científico para jóvenes colombianos
# Para usar en Claude Code CLI en un proyecto React + Vite nuevo

---

## CONTEXTO DEL PROYECTO

Construye una aplicación web completa llamada **vocacion.co** (o el dominio disponible).
Es un orientador vocacional gratuito para jóvenes colombianos de grado 10 y 11, y bachilleres
recién graduados, que les ayuda a identificar la carrera universitaria, tecnológica o técnica
donde tendrán mayor satisfacción personal. Está diseñado para funcionar en todo el territorio
nacional, considerando diferencias regionales en oferta académica y condiciones económicas.

**Problema que resuelve:** Los jóvenes colombianos eligen carrera por moda, presión familiar,
o lo que hacen sus amigos, no por vocación real. Esto genera alta deserción universitaria y
frustración personal.

**Base científica:** El test cruza tres marcos validados de psicología vocacional:
1. Teoría de Holland RIASEC (John Holland, 1959–1997)
2. Teoría de las Inteligencias Múltiples (Howard Gardner, Harvard, 1983)
3. Teoría de Valores de Trabajo (Donald Super, 1957–1990)

---

## STACK TÉCNICO

```
React 18 + Vite + Tailwind CSS
Supabase (PostgreSQL + Auth anónima + RLS)
Vercel (deploy automático desde GitHub)
React Router v6
react-hook-form
Zustand (estado global del test)
Recharts (gráfico de perfil en resultados)
```

**Comandos de inicio:**
```bash
npm create vite@latest vocacion-co -- --template react
cd vocacion-co
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @supabase/supabase-js react-router-dom zustand react-hook-form recharts
```

---

## ESTRUCTURA DE CARPETAS

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── test/
│   │   ├── ProgressBar.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── OptionButton.jsx
│   │   ├── LikertScale.jsx
│   │   └── MultiSelect.jsx
│   ├── results/
│   │   ├── ProfileChart.jsx
│   │   ├── CareerCard.jsx
│   │   ├── UniversityTags.jsx
│   │   └── ShareButton.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Badge.jsx
│       └── Spinner.jsx
├── pages/
│   ├── Home.jsx          ← Landing page con CTA
│   ├── Test.jsx          ← Motor del test multi-paso
│   ├── Results.jsx       ← Resultados + gráfico + carreras
│   ├── Share.jsx         ← Página pública de resultado compartido
│   └── About.jsx         ← Qué es, base científica, FAQ
├── data/
│   ├── questions.js      ← Las 16 preguntas del test
│   ├── careers.js        ← Base de datos de 20+ carreras colombianas
│   ├── universities.js   ← Universidades por región
│   └── scoring.js        ← Algoritmo de scoring RIASEC + valores
├── store/
│   └── testStore.js      ← Zustand: respuestas, paso actual, resultado
├── lib/
│   ├── supabase.js       ← Cliente Supabase
│   ├── scoring.js        ← Lógica de cálculo de perfil y matching
│   └── share.js          ← Generar y recuperar resultados compartidos
└── styles/
    └── index.css
```

---

## BASE DE DATOS SUPABASE

### Tabla: `test_results`
```sql
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  answers JSONB NOT NULL,
  scores JSONB NOT NULL,          -- { R: 18, I: 22, A: 10, S: 14, E: 8, C: 12 }
  top_type TEXT NOT NULL,         -- 'I', 'S', etc.
  top_careers TEXT[] NOT NULL,    -- ['Medicina', 'Psicología', 'Biología']
  region TEXT,
  modalidad_pref TEXT,
  situacion_economica TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: cualquiera puede insertar, solo puede leer por share_code
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_anon" ON test_results FOR INSERT WITH CHECK (true);
CREATE POLICY "read_by_code" ON test_results FOR SELECT
  USING (share_code = current_setting('request.jwt.claims', true)::json->>'share_code'
         OR true);  -- público por share_code
```

### Tabla: `analytics_events` (opcional, fase 2)
```sql
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL,       -- 'test_started', 'test_completed', 'result_shared'
  region TEXT,
  top_career TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_anon" ON analytics_events FOR INSERT WITH CHECK (true);
```

---

## PREGUNTAS DEL TEST (16 preguntas, 4 bloques)

### BLOQUE 1 — Personalidad (Holland RIASEC)

**P1. ¿Cuál de estas situaciones disfrutas más?**
Tipo: selección única
- R: "Arreglar, construir o trabajar con mis manos" / "Me gustan las herramientas, los mecanismos, las cosas concretas"
- I: "Investigar y entender cómo funciona todo" / "Me gusta analizar, hacer experimentos, resolver problemas complejos"
- A: "Crear, diseñar o expresarme" / "Me gusta el arte, la música, escribir, diseñar cosas nuevas"
- S: "Ayudar, enseñar o cuidar a otros" / "Disfruto trabajar con personas, escuchar, orientar"
- E: "Liderar, convencer y tomar decisiones" / "Me gusta emprender, vender ideas, dirigir proyectos"
- C: "Organizar, clasificar y seguir procesos con orden" / "Me gusta que todo esté en su lugar, trabajar con datos y reglas"

**P2. Cuando tienes tiempo libre, ¿qué haces por gusto propio?**
Tipo: selección única
- R: "Actividades al aire libre, deporte o manualidades"
- I: "Leer sobre ciencia, tecnología o documentales"
- A: "Crear contenido, música, arte o escritura"
- S: "Pasar tiempo con amigos o hacer voluntariado"
- E: "Planear negocios, ver emprendimientos o debates"
- C: "Organizar mi cuarto, mis finanzas o hacer listas"

**P3. Si pudieras elegir cómo trabajar, ¿qué preferirías?**
Tipo: selección única
- R: "Con herramientas, equipos o en espacios físicos"
- I: "Con datos, libros, laboratorios o computadores"
- A: "Con creatividad, sin reglas fijas, expresando ideas"
- S: "Con personas, en equipo, ayudando directamente"
- E: "Dirigiendo un equipo o negociando proyectos"
- C: "Siguiendo procesos claros, con orden y precisión"

**P4. ¿Qué tipo de logro te haría sentir más orgulloso/a?**
Tipo: selección única
- R: "Construir o arreglar algo con mis propias manos"
- I: "Descubrir algo nuevo o resolver un problema difícil"
- A: "Crear una obra que emocione o inspire a otros"
- S: "Haber cambiado la vida de alguien para mejor"
- E: "Haber creado una empresa o liderado un equipo exitoso"
- C: "Haber organizado algo complejo de forma perfecta"

### BLOQUE 2 — Habilidades (Inteligencias Múltiples)

**P5. ¿En cuál de estas cosas tus amigos o profesores dicen que eres bueno/a?**
Tipo: multiselección (máx. 2)
- LG: "Hablar y escribir bien" (Lingüística)
- LM: "Matemáticas y lógica" (Lógico-matemática)
- MU: "Música y sentido del ritmo" (Musical)
- ES: "Dibujar, diseñar o visualizar espacios" (Espacial)
- CK: "Deporte, baile o habilidades físicas" (Corporal-kinestésica)
- IN: "Entender a las personas y llevarte bien con todos" (Interpersonal)
- IP: "Conocerte bien a ti mismo/a, reflexionar" (Intrapersonal)
- NA: "Entender la naturaleza, animales o plantas" (Naturalista)

**P6. ¿Cuál materia del colegio se te hacía más fácil Y más interesante?**
Tipo: selección única
- LG: "Español / Literatura"
- LM: "Matemáticas / Física"
- BI: "Biología / Química"
- SC: "Ciencias sociales / Historia / Filosofía"
- AR: "Artes / Educación artística / Música"
- EF: "Educación física / Deportes"
- IN: "Inglés / Idiomas"
- TI: "Tecnología e informática"

**P7. Si tuvieras que enseñarle algo a alguien, ¿qué elegirías enseñar?**
Tipo: selección única
- LG: "Cómo escribir bien o hablar en público"
- LM: "Cómo resolver problemas matemáticos o de lógica"
- MU: "Cómo tocar un instrumento o componer"
- ES: "Cómo dibujar, diseñar o crear visualmente"
- CK: "Cómo hacer deporte, danza o técnicas físicas"
- IN: "Cómo entender a las personas y resolver conflictos"
- NA: "Cómo cuidar el medio ambiente o entender la naturaleza"
- TI: "Cómo usar tecnología, programar o hacer videos"

### BLOQUE 3 — Valores de Trabajo (Super)

**P8. ¿Qué es lo más importante para ti en un trabajo futuro?**
Tipo: selección única
- DI: "Ganar buen dinero y tener estabilidad económica"
- AU: "Ser mi propio jefe / tener libertad y autonomía"
- IM: "Ayudar a los demás y tener impacto social"
- CR: "Hacer cosas nuevas e innovar constantemente"
- CO: "Aprender siempre y profundizar en mi área"
- RS: "Ser reconocido/a y tener prestigio profesional"

**P9. Imagina tu día ideal de trabajo en 10 años. ¿Dónde estás?**
Tipo: selección única
- OF: "En una oficina moderna, con equipo y reuniones"
- CA: "En campo, en movimiento o en la naturaleza"
- SA: "En un hospital, clínica, laboratorio o farmacia"
- REM: "Desde casa o trabajando de forma independiente"
- NEG: "En mi propio negocio o empresa"
- CRE: "En un estudio, galería, medio o espacio creativo"
- EDU: "En un colegio, universidad o institución pública"

**P10. ¿Cuál de estas frases te describe más?**
Tipo: selección única
- "Quiero que mi trabajo cambie vidas y haga el mundo mejor" → IM
- "Quiero crear cosas que no existían antes" → CR
- "Quiero entender cómo funciona todo a fondo" → CO
- "Quiero liderar y que otros me sigan" → E (Holland)
- "Quiero un trabajo estable con buen salario" → DI
- "Quiero ser libre para tomar mis propias decisiones" → AU

### BLOQUE 4 — Contexto colombiano

**P11. ¿Cuánto tiempo quieres estudiar antes de trabajar?**
Tipo: selección única
- T: "1-2 años — técnico profesional (SENA, institutos)" / "Quiero trabajar pronto y seguir estudiando después"
- TEC: "2-3 años — tecnólogo" / "Buen balance entre tiempo y proyección"
- U: "4-5 años — universitario" / "Quiero el título profesional completo"
- UP: "Más de 5 años — con especialización o posgrado" / "Quiero especializarme al máximo"

**P12. ¿Cuál es tu departamento o región en Colombia?**
Tipo: selección única (dropdown o grid)
Opciones: Bogotá D.C. | Antioquia | Cundinamarca | Valle del Cauca |
Santander | Norte de Santander | Atlántico | Bolívar | Córdoba |
Nariño | Cauca | Boyacá | Tolima | Huila | Meta | Risaralda |
Caldas | Quindío | Magdalena | Cesar | La Guajira | Sucre |
Chocó | Arauca | Casanare | Putumayo | Caquetá | Amazonas |
Vaupés | Guainía | Vichada | Guaviare | San Andrés

**P13. ¿Cómo es tu situación económica para estudiar?**
Tipo: selección única
- PUB: "Necesito universidad pública gratuita o beca (Matrícula Cero, ICETEX, SENA)"
- MIX: "Puedo pagar algo pero busco opciones asequibles"
- PRI: "Puedo acceder a cualquier institución sin restricción económica"

### BLOQUE 4B — Escala Likert (confirmación)

**P14. Puntúa del 1 al 5 qué tan bien te describe cada afirmación:**
(1 = no me describe nada, 5 = me describe perfectamente)

- "Me resulta fácil hablar en público y explicar ideas a otros" → confirma A/S
- "Disfruto resolver acertijos, problemas matemáticos o de lógica" → confirma I
- "Siento que tengo vocación para cuidar o sanar a otras personas" → confirma S
- "Me gusta imaginar y crear cosas que todavía no existen" → confirma A/CR
- "Me motiva mucho la idea de tener mi propio negocio algún día" → confirma E
- "Me atraen los animales, las plantas o el medio ambiente natural" → confirma R/NA
- "Prefiero trabajar solo/a y a mi propio ritmo que en grupo" → matiz AU/IP
- "Me gusta cuando hay reglas claras y procesos definidos" → confirma C

**P15. ¿Hay algún campo que ya estés considerando?** (opcional)
Tipo: selección única
- MED: "Ciencias de la salud (Medicina, Enfermería, etc.)"
- ING: "Ingeniería y tecnología"
- ADM: "Administración, negocios o economía"
- DER: "Derecho o ciencias políticas"
- ART: "Artes, diseño o comunicación"
- EDU: "Educación o licenciatura"
- AGR: "Agronomía, veterinaria o medio ambiente"
- SOC: "Ciencias sociales, psicología o trabajo social"
- NS: "No sé todavía — por eso hago este test"

**P16. ¿Tienes personas cercanas que estudian o trabajan en algún área específica?** (opcional)
Tipo: selección única
Propósito: detectar sesgo de influencia familiar/social
- "Sí, en salud"
- "Sí, en ingeniería o tecnología"
- "Sí, en administración o negocios"
- "Sí, en otra área"
- "No / no me influye en esta decisión"

---

## ALGORITMO DE SCORING (src/lib/scoring.js)

```javascript
export function calcularPerfil(respuestas) {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  // Holland directo (peso alto)
  const hollandMap = {
    q1: 3, q2: 2, q3: 3, q4: 2  // preguntas P1-P4
  };
  Object.entries(hollandMap).forEach(([q, peso]) => {
    if (respuestas[q]) scores[respuestas[q]] += peso;
  });

  // Inteligencias múltiples → Holland (peso medio)
  const intelToHolland = {
    LG: ['A', 'S'], LM: ['I', 'C'], MU: ['A'], ES: ['A', 'R'],
    CK: ['R', 'S'], IN: ['S', 'E'], IP: ['S', 'A'], NA: ['R', 'I'],
    BI: ['I'], SC: ['S', 'I'], AR: ['A'], EF: ['R', 'S'],
    IN_idioma: ['A', 'S'], TI: ['I', 'R']
  };
  const q5 = respuestas.q5 || [];
  q5.forEach(v => {
    (intelToHolland[v] || []).forEach(t => { scores[t] += 2; });
  });
  if (respuestas.q6 && intelToHolland[respuestas.q6]) {
    intelToHolland[respuestas.q6].forEach(t => { scores[t] += 1.5; });
  }
  if (respuestas.q7 && intelToHolland[respuestas.q7]) {
    intelToHolland[respuestas.q7].forEach(t => { scores[t] += 1; });
  }

  // Valores → Holland (peso medio)
  const valoresMap = { DI: 'E', AU: 'E', IM: 'S', CR: 'A', CO: 'I', RS: 'E' };
  if (respuestas.q8 && valoresMap[respuestas.q8]) scores[valoresMap[respuestas.q8]] += 2;
  const ambienteMap = { OF: 'C', CA: 'R', SA: 'S', REM: 'A', NEG: 'E', CRE: 'A', EDU: 'S' };
  if (respuestas.q9 && ambienteMap[respuestas.q9]) scores[ambienteMap[respuestas.q9]] += 1.5;

  // Likert (P14) → confirmación directa (peso bajo-medio)
  const likertMap = ['A', 'I', 'S', 'A', 'E', 'R', 'A', 'C'];
  const likert = respuestas.likert || [];
  likert.forEach((v, i) => {
    if (likertMap[i]) scores[likertMap[i]] += v * 0.8;
  });

  // Normalizar a porcentajes
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const perfil = {};
  Object.entries(scores).forEach(([k, v]) => {
    perfil[k] = Math.round((v / total) * 100);
  });

  // Top 2 tipos
  const ordenado = Object.entries(perfil).sort((a, b) => b[1] - a[1]);
  const top2 = ordenado.slice(0, 2).map(e => e[0]);

  return { scores, perfil, top2 };
}

export function matchCarreras(perfil, respuestas, carrerasDB) {
  const { top2 } = perfil;
  const modPref = respuestas.q11 || 'U';
  const econ = respuestas.q13 || 'MIX';
  const q5 = respuestas.q5 || [];
  const q8 = respuestas.q8;
  const q9 = respuestas.q9;

  return carrerasDB
    .map(c => {
      let score = 0;

      // Match Holland
      top2.forEach((t, i) => {
        if (c.tipos.includes(t)) score += (4 - i * 1.5);
      });

      // Match inteligencias
      q5.forEach(v => { if (c.inteligencias.includes(v)) score += 2; });
      if (respuestas.q6 && c.inteligencias.includes(respuestas.q6)) score += 1;

      // Match valores
      if (q8 && c.valores.includes(q8)) score += 2;
      if (q9 && c.ambientes.includes(q9)) score += 1.5;

      // Match modalidad (bonus por ajuste)
      if (c.modalidad === modPref) score += 3;
      if (econ === 'PUB' && ['T', 'TEC'].includes(c.modalidad)) score += 2;

      return { ...c, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
```

---

## BASE DE DATOS DE CARRERAS (src/data/careers.js)

```javascript
export const CARRERAS = [
  {
    id: 'ingenieria-sistemas',
    nombre: 'Ingeniería de Sistemas',
    area: 'Ingeniería y Tecnología',
    tipos: ['I', 'R', 'C'],
    inteligencias: ['LM', 'TI'],
    valores: ['DI', 'AU', 'CO'],
    ambientes: ['OF', 'REM'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 5 años',
    descripcion: 'Diseñas, construyes y mantienes sistemas de software e infraestructura tecnológica. Alta demanda y excelente proyección salarial.',
    mercadoLaboral: 'Primera carrera por demanda en 2026 (24% de matrículas). Salarios de enganche desde $2.8M. Teletrabajo disponible en la mayoría de empresas.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'Uniandes', 'U. Distrital', 'EAN'],
      'Antioquia': ['U. de Antioquia', 'EAFIT', 'UPB', 'U. de Medellín'],
      'Norte de Santander': ['UFPS Ocaña', 'UFPS Cúcuta', 'U. de Pamplona'],
      'Santander': ['UIS', 'UNAB', 'UDES'],
      'Valle del Cauca': ['Univalle', 'U. ICESI', 'U. de San Buenaventura'],
      'Atlántico': ['U. del Norte', 'U. del Atlántico'],
      'default': ['SENA Virtual', 'Uniminuto Virtual', 'U. Nacional (distancia)']
    },
    becas: ['Matrícula Cero en públicas', 'ICETEX línea tecnología', 'MinTIC becas digitales'],
    tag: 'Alta demanda'
  },
  {
    id: 'medicina',
    nombre: 'Medicina',
    area: 'Ciencias de la Salud',
    tipos: ['I', 'S'],
    inteligencias: ['BI', 'LM', 'IN'],
    valores: ['IM', 'RS', 'CO'],
    ambientes: ['SA'],
    modalidad: 'UP',
    modalidadLabel: 'Universitaria + Especialización · 7-12 años',
    descripcion: 'Diagnosticas y tratas enfermedades. Requiere vocación de servicio y alto compromiso académico de largo plazo.',
    mercadoLaboral: 'Alta empleabilidad. Salarios desde $4M en enganche. Posgrado casi obligatorio para ejercer de forma especializada.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'Javeriana', 'U. del Rosario', 'U. de los Andes'],
      'Antioquia': ['U. de Antioquia', 'CES', 'U. Pontificia Bolivariana'],
      'Norte de Santander': ['UFPS Cúcuta', 'U. de Pamplona'],
      'Santander': ['UIS', 'U. de Santander (UDES)'],
      'Valle del Cauca': ['Univalle', 'U. Santiago de Cali'],
      'Atlántico': ['U. del Norte', 'U. Metropolitana'],
      'default': ['U. de Sucre', 'U. del Sinú', 'U. del Magdalena']
    },
    becas: ['Matrícula Cero en públicas', 'Fondo MEN para medicina en municipios apartados'],
    tag: 'Máximo prestigio'
  },
  {
    id: 'psicologia',
    nombre: 'Psicología',
    area: 'Ciencias Sociales y Humanas',
    tipos: ['S', 'I', 'A'],
    inteligencias: ['IN', 'IP', 'LG'],
    valores: ['IM', 'CO'],
    ambientes: ['OF', 'EDU', 'SA'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 5 años',
    descripcion: 'Estudias el comportamiento humano para ayudar a personas, equipos y organizaciones. Creciente demanda en salud mental, RR.HH. y educación.',
    mercadoLaboral: '8% de las matrículas 2026. Alta demanda en sector empresarial, salud y educativo. Bilingüismo abre mercado internacional.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'Javeriana', 'Konrad Lorenz', 'USTA', 'U. de los Andes'],
      'Antioquia': ['U. de Antioquia', 'CES', 'UPB'],
      'Norte de Santander': ['UFPS Ocaña', 'UDES', 'U. de Pamplona'],
      'Santander': ['UNAB', 'UIS', 'UDES'],
      'Valle del Cauca': ['Univalle', 'U. Santiago de Cali', 'U. ICESI'],
      'Atlántico': ['U. del Norte', 'U. Simón Bolívar'],
      'default': ['Uniminuto', 'U. Nacional (distancia)']
    },
    becas: ['Matrícula Cero en públicas', 'ICETEX'],
    tag: 'Creciente demanda'
  },
  {
    id: 'administracion-empresas',
    nombre: 'Administración de Empresas',
    area: 'Economía, Administración y Contaduría',
    tipos: ['E', 'C', 'S'],
    inteligencias: ['LG', 'LM', 'IN'],
    valores: ['DI', 'AU', 'RS'],
    ambientes: ['OF', 'NEG'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 4-5 años',
    descripcion: 'Planeas, organizas y diriges organizaciones. Versatilidad total: aplica en todos los sectores económicos.',
    mercadoLaboral: 'Empleabilidad del 94%. Salario promedio de enganche ~$2.5M. Base ideal para emprender.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'Uniandes', 'CESA', 'EAN', 'U. Externado'],
      'Antioquia': ['EAFIT', 'UPB', 'U. de Medellín', 'U. de Antioquia'],
      'Norte de Santander': ['UFPS Ocaña', 'UNAB', 'UDES'],
      'Santander': ['UNAB', 'UIS', 'U. Santo Tomás'],
      'Valle del Cauca': ['Univalle', 'U. ICESI', 'U. del Pacífico'],
      'Atlántico': ['U. del Norte', 'U. del Atlántico'],
      'default': ['Uniminuto', 'SENA (tecnología)']
    },
    becas: ['Matrícula Cero', 'ICETEX', 'Becas institucionales por mérito'],
    tag: 'Alta empleabilidad'
  },
  {
    id: 'diseno-grafico',
    nombre: 'Diseño Gráfico / Comunicación Visual',
    area: 'Bellas Artes',
    tipos: ['A', 'E', 'I'],
    inteligencias: ['ES', 'LG', 'MU', 'TI'],
    valores: ['CR', 'AU'],
    ambientes: ['CRE', 'REM'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 4 años',
    descripcion: 'Comunicas ideas a través de imágenes, tipografía y medios digitales. Alta demanda en marketing digital, branding y desarrollo de apps.',
    mercadoLaboral: 'Economía creativa en auge. Diseñadores de experiencias digitales son perfil del futuro según la Javeriana. Trabajo freelance desde el primer año.',
    universidades: {
      'Bogotá D.C.': ['Javeriana', 'Uniandes', 'U. Nacional', 'U. Jorge Tadeo Lozano', 'CREA'],
      'Antioquia': ['EAFIT', 'U. de Medellín', 'UPB'],
      'Norte de Santander': ['UFPS Ocaña', 'UNAB'],
      'Santander': ['UNAB', 'U. Santo Tomás'],
      'Valle del Cauca': ['Univalle', 'U. ICESI'],
      'Atlántico': ['U. del Norte', 'U. Autónoma del Caribe'],
      'default': ['SENA Virtual', 'Uniminuto Virtual']
    },
    becas: ['Matrícula Cero', 'MinCultura becas artes'],
    tag: 'Economía creativa'
  },
  {
    id: 'derecho',
    nombre: 'Derecho',
    area: 'Ciencias Sociales y Humanas',
    tipos: ['E', 'S', 'I'],
    inteligencias: ['LG', 'IN'],
    valores: ['RS', 'IM', 'AU'],
    ambientes: ['OF', 'EDU'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 5 años',
    descripcion: 'Estudias el ordenamiento jurídico y defiendes los derechos de personas e instituciones. Amplias salidas en litigio, empresa, política y academia.',
    mercadoLaboral: 'Carrera de alto prestigio y buena empleabilidad. Requiere fuerte habilidad verbal y argumentativa.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'U. del Rosario', 'Externado', 'Javeriana', 'U. de los Andes'],
      'Antioquia': ['U. de Antioquia', 'UPB', 'U. de Medellín'],
      'Norte de Santander': ['UFPS Ocaña', 'UDES', 'U. de Pamplona'],
      'Santander': ['UNAB', 'UIS', 'U. Autónoma de Bucaramanga'],
      'Valle del Cauca': ['Univalle', 'U. Santiago de Cali', 'U. Libre'],
      'Atlántico': ['U. del Norte', 'U. del Atlántico', 'U. Simón Bolívar'],
      'default': ['USTA', 'U. Libre', 'Uniminuto']
    },
    becas: ['Matrícula Cero en públicas', 'ICETEX'],
    tag: 'Alto prestigio'
  },
  {
    id: 'ingenieria-ambiental',
    nombre: 'Ingeniería Ambiental',
    area: 'Ingeniería y Tecnología',
    tipos: ['I', 'R', 'S'],
    inteligencias: ['BI', 'NA', 'LM'],
    valores: ['IM', 'CO'],
    ambientes: ['CA', 'OF'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 5 años',
    descripcion: 'Diseñas soluciones para la crisis climática y la sostenibilidad. Una de las carreras con mayor crecimiento a nivel mundial.',
    mercadoLaboral: 'Gestores de sostenibilidad corporativa: perfil del futuro (Javeriana 2025). Alta demanda en minería, agricultura y sector público.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'Javeriana', 'U. Distrital', 'EAN'],
      'Antioquia': ['U. de Antioquia', 'U. de Medellín'],
      'Norte de Santander': ['UFPS Ocaña', 'UFPS Cúcuta', 'UNAB'],
      'Santander': ['UIS', 'UNAB'],
      'Valle del Cauca': ['Univalle', 'U. del Cauca'],
      'Atlántico': ['U. del Norte', 'U. del Atlántico'],
      'default': ['U. del Quindío', 'U. de Caldas', 'U. de los Llanos']
    },
    becas: ['Matrícula Cero', 'ICETEX línea ciencias ambientales'],
    tag: 'Carrera del futuro'
  },
  {
    id: 'licenciatura',
    nombre: 'Licenciatura en Educación',
    area: 'Ciencias de la Educación',
    tipos: ['S', 'A', 'C'],
    inteligencias: ['LG', 'IN', 'IP'],
    valores: ['IM', 'CO'],
    ambientes: ['EDU'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 4 años',
    descripcion: 'Formas a las nuevas generaciones. Puedes especializarte en cualquier área del conocimiento. Alta demanda en zonas rurales y municipios.',
    mercadoLaboral: 'Alta demanda en municipios intermedios. Becas especiales para licenciaturas en ciencias y matemáticas. Estabilidad laboral en sector público.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'U. Pedagógica', 'Uniminuto', 'U. Externado'],
      'Antioquia': ['U. de Antioquia', 'U. de Medellín', 'UPB'],
      'Norte de Santander': ['UFPS Ocaña', 'U. de Pamplona', 'UDES'],
      'Santander': ['UIS', 'UNAB'],
      'Valle del Cauca': ['Univalle', 'U. del Cauca'],
      'Atlántico': ['U. del Atlántico', 'U. del Magdalena'],
      'default': ['U. de Córdoba', 'U. de la Guajira', 'Uniminuto Virtual']
    },
    becas: ['Matrícula Cero', 'Becas Ser Pilo Paga renovadas', 'Fondo MEN para docentes'],
    tag: 'Impacto social'
  },
  {
    id: 'medicina-veterinaria',
    nombre: 'Medicina Veterinaria y Zootecnia',
    area: 'Agronomía, Veterinaria y Afines',
    tipos: ['R', 'I', 'S'],
    inteligencias: ['BI', 'NA', 'CK'],
    valores: ['IM', 'CO'],
    ambientes: ['CA', 'SA'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 5 años',
    descripcion: 'Cuidas la salud animal y el sistema de producción agropecuario. Muy relevante en un país como Colombia con vocación agrícola y ganadera.',
    mercadoLaboral: 'Alta relevancia en regiones ganaderas como los Llanos, Córdoba, Norte de Santander y Antioquia. Sector en crecimiento.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'U. de la Salle', 'U. de Ciencias Aplicadas'],
      'Antioquia': ['U. de Antioquia', 'CES'],
      'Norte de Santander': ['U. de Pamplona', 'UFPS Cúcuta'],
      'Santander': ['U. de Santander'],
      'Valle del Cauca': ['U. del Cauca'],
      'Meta': ['U. de los Llanos'],
      'default': ['U. del Tolima', 'U. de Córdoba', 'U. de Sucre']
    },
    becas: ['Matrícula Cero', 'Programa Jóvenes del Campo (MinAgricultura)'],
    tag: 'Vocación rural'
  },
  {
    id: 'tecnologia-software',
    nombre: 'Tecnología en Desarrollo de Software',
    area: 'Ingeniería y Tecnología',
    tipos: ['I', 'R', 'C'],
    inteligencias: ['LM', 'TI'],
    valores: ['DI', 'AU'],
    ambientes: ['OF', 'REM'],
    modalidad: 'TEC',
    modalidadLabel: 'Tecnológica · 3 años',
    descripcion: 'Desarrollas aplicaciones web, móviles y sistemas en la mitad del tiempo. Acceso rápido al mercado laboral tech con salarios competitivos.',
    mercadoLaboral: 'Alta demanda. Salarios desde $1.8M primer empleo. SENA y otras IES con excelente calidad. Puedes continuar a ingeniería después.',
    universidades: {
      'default': ['SENA (todo el país)', 'Uniminuto Virtual', 'Politécnico Gran Colombiano', 'ITSA'],
      'Bogotá D.C.': ['SENA', 'Uniminuto', 'Politécnico GC', 'EAN'],
      'Antioquia': ['SENA', 'Politécnico JIC', 'UPB'],
      'Norte de Santander': ['SENA Ocaña', 'SENA Cúcuta', 'UFPS Ocaña']
    },
    becas: ['SENA gratuito', 'MinTIC becas digitales', 'Matrícula Cero en públicas'],
    tag: 'Acceso rápido'
  },
  {
    id: 'fisioterapia',
    nombre: 'Fisioterapia',
    area: 'Ciencias de la Salud',
    tipos: ['S', 'R', 'I'],
    inteligencias: ['CK', 'IN', 'BI'],
    valores: ['IM', 'CO'],
    ambientes: ['SA', 'CA'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 4-5 años',
    descripcion: 'Rehabilitas el movimiento y la función física de personas con lesiones o enfermedades. Segunda carrera más demandada en 2026.',
    mercadoLaboral: '18% de las matrículas 2026. Crecimiento por deporte de alto rendimiento, gerontología y neurorehabilitación.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'Manuela Beltrán', 'CUN', 'U. del Bosque'],
      'Antioquia': ['U. de Antioquia', 'CES'],
      'Norte de Santander': ['UFPS Ocaña', 'U. de Pamplona'],
      'Santander': ['UDES', 'UNAB'],
      'Valle del Cauca': ['Univalle', 'U. Santiago de Cali'],
      'Atlántico': ['U. Metropolitana', 'U. del Norte'],
      'default': ['Uniminuto', 'U. Libre']
    },
    becas: ['Matrícula Cero', 'ICETEX'],
    tag: 'Segunda más demandada'
  },
  {
    id: 'comunicacion-social',
    nombre: 'Comunicación Social y Periodismo',
    area: 'Ciencias Sociales y Humanas',
    tipos: ['A', 'S', 'E'],
    inteligencias: ['LG', 'IN', 'ES'],
    valores: ['CR', 'IM', 'RS'],
    ambientes: ['CRE', 'OF', 'REM'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 4-5 años',
    descripcion: 'Informas, persuades y construyes narrativas. En la era digital, los comunicadores que dominan redes, video y datos son altamente demandados.',
    mercadoLaboral: 'Alta versatilidad: medios, marketing, ONG, política, empresas. Freelance desde el primer año. Bilingüismo multiplica oportunidades.',
    universidades: {
      'Bogotá D.C.': ['Javeriana', 'Externado', 'U. del Rosario', 'Uniminuto'],
      'Antioquia': ['U. de Antioquia', 'EAFIT', 'U. Pontificia Bolivariana'],
      'Norte de Santander': ['UFPS Ocaña', 'UNAB'],
      'Santander': ['UNAB', 'UIS'],
      'Valle del Cauca': ['Univalle', 'U. Autónoma de Occidente'],
      'Atlántico': ['U. del Norte', 'U. del Atlántico'],
      'default': ['Uniminuto Virtual', 'U. Minuto de Dios']
    },
    becas: ['Matrícula Cero', 'MinCultura'],
    tag: 'Era digital'
  },
  {
    id: 'contaduria',
    nombre: 'Contaduría Pública',
    area: 'Economía, Administración y Contaduría',
    tipos: ['C', 'E', 'I'],
    inteligencias: ['LM', 'IN'],
    valores: ['DI', 'CO'],
    ambientes: ['OF'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 4-5 años',
    descripcion: 'Registras, analizas y controlas la información financiera de organizaciones. Fundamental para cualquier empresa o entidad pública.',
    mercadoLaboral: 'Alta empleabilidad permanente. Todas las empresas necesitan contador. Tarjeta profesional tras inscripción en la Junta Central de Contadores.',
    universidades: {
      'default': ['U. Nacional', 'U. del Rosario', 'USTA', 'Uniminuto'],
      'Norte de Santander': ['UFPS Ocaña', 'UNAB', 'UDES'],
      'Bogotá D.C.': ['U. Nacional', 'U. Central', 'Uniminuto', 'U. Externado']
    },
    becas: ['Matrícula Cero', 'ICETEX'],
    tag: 'Siempre necesario'
  },
  {
    id: 'ingenieria-industrial',
    nombre: 'Ingeniería Industrial',
    area: 'Ingeniería y Tecnología',
    tipos: ['I', 'E', 'C'],
    inteligencias: ['LM', 'IN'],
    valores: ['DI', 'CO', 'AU'],
    ambientes: ['OF', 'CA'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 5 años',
    descripcion: 'Optimizas procesos, recursos y personas en empresas de cualquier sector. Puente entre la ingeniería técnica y la gestión empresarial.',
    mercadoLaboral: 'Alta demanda en manufactura, logística, sector financiero y consultoría. Perfil muy buscado en multinacionales.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'Uniandes', 'Javeriana', 'EAN'],
      'Antioquia': ['EAFIT', 'UPB', 'U. de Antioquia'],
      'Norte de Santander': ['UFPS Ocaña', 'UNAB'],
      'Santander': ['UIS', 'UNAB'],
      'Valle del Cauca': ['Univalle', 'U. ICESI'],
      'Atlántico': ['U. del Norte'],
      'default': ['Uniminuto', 'U. Libre']
    },
    becas: ['Matrícula Cero', 'ICETEX línea ingeniería'],
    tag: 'Muy versátil'
  },
  {
    id: 'trabajo-social',
    nombre: 'Trabajo Social',
    area: 'Ciencias Sociales y Humanas',
    tipos: ['S', 'A', 'E'],
    inteligencias: ['IN', 'LG', 'IP'],
    valores: ['IM', 'CO'],
    ambientes: ['CA', 'EDU', 'OF'],
    modalidad: 'U',
    modalidadLabel: 'Universitaria · 4 años',
    descripcion: 'Intervines en problemáticas sociales para mejorar la calidad de vida de comunidades vulnerables. Alta relevancia en Colombia.',
    mercadoLaboral: 'Demanda en entidades públicas, ONG, sector privado y comunidades. Especialmente relevante en zonas de postconflicto.',
    universidades: {
      'Bogotá D.C.': ['U. Nacional', 'U. Externado', 'Uniminuto', 'U. Colegio Mayor'],
      'Antioquia': ['U. de Antioquia'],
      'Norte de Santander': ['UFPS Ocaña', 'U. de Pamplona'],
      'default': ['Uniminuto Virtual', 'U. del Valle', 'U. de Caldas']
    },
    becas: ['Matrícula Cero', 'Becas para víctimas del conflicto'],
    tag: 'Impacto comunitario'
  }
];
```

---

## PÁGINAS PRINCIPALES

### Home.jsx — Landing page
- Hero con titular impactante: "Descubre la carrera donde serás feliz"
- Subtítulo: "Test vocacional gratuito basado en ciencia. 16 preguntas. 8 minutos. Para cualquier joven colombiano."
- CTA principal: "Comenzar test gratuito"
- Sección: "¿Cómo funciona?" (3 pasos: Responde → Analizamos → Descubres)
- Sección: "Base científica" (3 cards: Holland, Gardner, Super)
- Sección: "¿Para quién es?" (grado 10, grado 11, bachiller recién graduado)
- Footer con: "Desarrollado con propósito social | Colombia 2025"

### Test.jsx — Motor del test
- Barra de progreso por bloques (Bloque 1/4, 2/4, etc.)
- Transición suave entre preguntas
- Estado guardado en Zustand (para que no se pierda si el usuario vuelve)
- Botón "Atrás" funcional en todas las preguntas
- Pregunta actual del total visible (ej: "Pregunta 5 de 16")
- Pregunta Likert (P14) con estrellas o escala numérica visual
- Al completar todas: loader animado con "Analizando tu perfil..." (1.5s) antes de navegar a resultados

### Results.jsx — Resultados
Secciones:
1. Header: "Tu perfil vocacional" con nombre del tipo Holland dominante
2. Gráfico de barras horizontales (Recharts) con los 6 tipos RIASEC en porcentajes
3. Resumen en prosa: "Tu combinación [IE] indica que..." (personalizado por top2)
4. Sección "Carreras recomendadas para ti" → top 3 CareerCards
5. Sección "¿Qué hacer ahora?" con 3 pasos accionables
6. Botón "Compartir mis resultados" → genera link único
7. Botón "Explorar más carreras" → muestra las 15 restantes en acordeón

### Share.jsx — Resultado compartido
- URL: /resultado/:shareCode
- Carga resultado de Supabase por shareCode
- Misma vista de resultados pero con banner "Este es el perfil vocacional de [nombre anónimo]"
- CTA: "¿Quieres conocer el tuyo? Hacer el test"
- Meta tags OG para compartir en WhatsApp con preview

---

## VARIABLES DE ENTORNO

```env
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

---

## FLUJO COMPLETO DE LA APP

```
/ (Home)
  → /test (Test multi-paso, 16 preguntas)
    → /resultados (Resultados personalizados)
      → /resultado/:shareCode (Resultado compartido públicamente)
/sobre-nosotros (About — base científica, FAQ)
```

---

## DISEÑO Y UX

- Paleta: verde Colombia (#007A53) como acento principal + neutros
- Tipografía: Inter (Google Fonts) — moderna, legible en móvil
- Mobile-first — mayoría de jóvenes acceden desde celular
- Sin registro obligatorio — el test corre sin cuenta
- Compartir resultados genera URL única sin necesidad de crear cuenta
- Tiempo estimado visible en la landing: "8 minutos"
- Pregunta por pantalla (no formulario largo) — reduce abandono

---

## POSIBILIDADES DE MONETIZACIÓN (fase 2)

1. **Plan institucional para colegios** — panel admin, resultados de todos los estudiantes, reportes PDF. Precio: $150.000/mes por colegio.
2. **Informe detallado premium** — PDF de 10 páginas con perfil completo, plan de estudio sugerido, hoja de ruta de 5 años. Precio: $15.000 por informe (Wompi/PSE).
3. **API white-label** — para que Secretarías de Educación municipales lo integren en su sitio. Precio: $500.000/mes.
4. **Publicidad contextual** — universidades y programas que quieran aparecer como recomendados. Solo ética: nunca afecta el algoritmo de scoring.

---

## SESIONES SUGERIDAS EN CLAUDE CODE

**Sesión 1:** Estructura base + Home + Test (preguntas 1-8) + store Zustand
**Sesión 2:** Test (preguntas 9-16) + algoritmo scoring + página Results con gráfico
**Sesión 3:** Supabase (guardar resultados + share code) + Share page + meta OG tags
**Sesión 4:** Diseño final mobile + animaciones + About page + deploy Vercel

---

## NOTAS IMPORTANTES

- Diagnostica antes de cambiar (principio CLAUDE.md)
- Cada sesión inicia con `cat CLAUDE.md` y termina actualizando el estado del proyecto
- El algoritmo de scoring es el corazón del producto — no simplificar
- Las universidades por departamento deben ser reales y verificadas
- El lenguaje del test debe ser natural, cercano a jóvenes colombianos (tuteo)
- Evitar jerga técnica en las preguntas — debe entenderlo un joven de 15 años

