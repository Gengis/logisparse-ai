## 🛡️ Arquitectura Sovereign Node & QVAC Integration

LogisParse-AI está construido bajo un enfoque **Edge-First / Local-First**:

- **Edge Processing Engine (`@qvac/sdk`):** En entornos locales de auditores de campo (offline/dispositivos Edge), la extracción de entidades clínicas (equipo, marca, antigüedad) se realiza ejecutando el modelo **QVAC LLm** de forma local sin enviar datos a servidores externos, garantizando la privacidad del paciente y cumplimiento de normativas de salud.
- **Serverless Cloud Fallback:** Para despliegues en la nube (Vercel), la aplicación detecta el entorno `process.env.VERCEL` para conmutar a un motor de inferencia optimizado que simula y entrega los payloads estructurados CSV/JSON de forma fluida.
- **Dictado Táctil & Procesamiento de Documentos:** Integra extracción mediante `SpeechRecognition` y procesamiento local de PDFs aduaneros exportables directamente a formatos `.xlsx` y `.csv`.

## 🚀 Guía de Reproducción Local (Para Jurados y Evaluadores)

Para ejecutar **LogisParse-AI & Sovereign Node** en tu entorno local y probar la extracción con Edge AI / QVAC:

### Prerrequisitos
- Node.js (v18.x o superior)
- npm o pnpm

### Pasos para la Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/Gengis/LogisParse-AI.git](https://github.com/Gengis/logisparse-ai.git)
   cd logisparse-ai