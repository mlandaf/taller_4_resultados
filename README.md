# Taller 4 — Análisis de Resultados: Tarea Go/No-Go

- **Asignatura:** Investigación e Intervención desde las Neurociencias Aplicadas  
- **Ciclo:** 2026-1  
- **Autor:** Marcelo Landa

**🔗 Aplicación:** [mlandaf.github.io/taller_4_resultados](https://mlandaf.github.io/taller_4_resultados)

---

## Descripción

Aplicación web para procesar y visualizar los resultados de la tarea Go/No-Go implementada en PsychoPy Builder durante el Taller 4.

No requiere instalar ningún software. Funciona directamente en el navegador.

---

## Cómo usar

1. Completar la tarea en PsychoPy Builder
2. Abrir la aplicación en el navegador usando el enlace de arriba
3. Arrastrar el archivo `.csv` generado por PsychoPy al área de carga
4. Confirmar las columnas del archivo en la pantalla de selección
5. Revisar los resultados

---

## Qué muestra la aplicación

| Sección | Contenido |
|---|---|
| Resumen global | Precisión (%), RT promedio en Go (ms) y tasa de errores de comisión |
| Por tipo de trial | Desglose de correctos, errores y RT para trials Go y No-Go |
| Comparación visual | Gráficos de barras de precisión y errores por tipo |
| Tabla de trials | Registro completo con tipo de trial, resultado (correcto, comisión, omisión) y RT |

> **Nota:** Solo se procesan los trials de la fase experimental. Los trials de práctica no se incluyen en el análisis.

---

## Métricas calculadas

- **RT en trials Go (ms):** tiempo de reacción promedio en trials Go correctos
- **Errores de comisión (%):** respuestas incorrectas en trials No-Go — medida central del control inhibitorio
- **Errores de omisión (%):** ausencia de respuesta en trials Go — refleja lapsos de atención

---

## Materiales del taller

Los archivos del experimento están disponibles en el repositorio principal:

**🔗 [github.com/mlandaf/taller_4_gonogo](https://github.com/mlandaf/taller_4_gonogo)**

---

## Contacto

**Marcelo Landa**  
Asistente de cátedra — Investigación e Intervención desde las Neurociencias Aplicadas  
Universidad de Lima
