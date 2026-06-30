import { supabase } from './supabase'

export async function guardarResultado({ respuestas, scores, perfil, top2, carreras }) {
  if (!supabase) throw new Error('Supabase no configurado')

  const payload = {
    answers: respuestas,
    scores: scores,
    top_type: top2[0],
    top_careers: carreras.slice(0, 3).map(c => c.nombre),
    region: respuestas.q12 || null,
    modalidad_pref: respuestas.q11 || null,
    situacion_economica: respuestas.q13 || null,
    modo_exploracion: respuestas.q0 || 'AMBAS',
  }

  const { data, error } = await supabase
    .from('test_results')
    .insert(payload)
    .select('share_code')
    .single()

  if (error) throw error
  return data.share_code
}

export async function obtenerResultado(shareCode) {
  if (!supabase) throw new Error('Supabase no configurado')

  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('share_code', shareCode)
    .single()

  if (error) throw error
  return data
}
