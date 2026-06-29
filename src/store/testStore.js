import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTestStore = create(
  persist(
    (set, get) => ({
      respuestas: {},
      pasoActual: 0,
      resultado: null,
      completado: false,

      setRespuesta: (preguntaId, valor) =>
        set((state) => ({
          respuestas: { ...state.respuestas, [preguntaId]: valor },
        })),

      setPaso: (paso) => set({ pasoActual: paso }),

      avanzar: () => set((state) => ({ pasoActual: state.pasoActual + 1 })),

      retroceder: () =>
        set((state) => ({ pasoActual: Math.max(0, state.pasoActual - 1) })),

      setResultado: (resultado) => set({ resultado, completado: true }),

      resetTest: () =>
        set({ respuestas: {}, pasoActual: 0, resultado: null, completado: false }),
    }),
    {
      name: 'vocacion-test',
    }
  )
)
