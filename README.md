# Taller 4 — Análisis de Resultados: Tarea Go/No-Go

- **Asignatura:** Investigación e Intervención desde las Neurociencias Aplicadas  
- **Ciclo:** 2026-2
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
4. Confirmar las columnas de la fase experimental: `es_go`, `.corr`, `.keys` y `.rt`. La columna `tipo` es opcional.
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

- **Precisión global (%):** ensayos correctos (Go y No-Go) / total de ensayos experimentales × 100.
- **RT en trials Go (ms):** tiempo de respuesta promedio de los ensayos Go correctos, convertido de segundos a milisegundos.
- **Errores de comisión (%):** ensayos No-Go con respuesta / total de ensayos No-Go × 100.
- **Errores de omisión (%):** ensayos Go sin respuesta / total de ensayos Go × 100.

También se muestran los aciertos Go y los rechazos correctos No-Go, con sus cantidades y porcentajes. No responder es correcto en No-Go y constituye una omisión en Go.

La selección de la columna `.keys` es obligatoria para distinguir las respuestas de las ausencias de respuesta. El lector admite CSV con campos entrecomillados, comas dentro de un campo, comillas escapadas y saltos de línea; también detecta separadores de punto y coma o tabulación.

El diseño del taller utiliza 80 % de ensayos Go y 20 % No-Go. El estímulo y la ventana de respuesta comienzan al mismo tiempo y duran hasta 1000 ms; una pulsación termina la presentación. En la fase experimental, después se presenta un ITI de 500 ms. La duración total del ensayo varía según el momento de respuesta.

---

## Verificación

Las pruebas utilizan datos sintéticos y se ejecutan con Node.js:

```sh
node --test tests/results.test.cjs
```

Comprueban las métricas, la exclusión de la práctica, la selección obligatoria de teclas y la lectura de CSV entrecomillados o incompletos.

---

## Materiales del taller

Los archivos del experimento están disponibles en el repositorio principal:

**🔗 [github.com/mlandaf/taller_4_gonogo](https://github.com/mlandaf/taller_4_gonogo)**

---

## Contacto

**Marcelo Landa**  
Asistente de cátedra — Investigación e Intervención desde las Neurociencias Aplicadas  
Universidad de Lima
