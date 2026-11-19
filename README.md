# 🚀 OpenCompilers Hub

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fblowerlol355-blip%2FCOMPILADORES-)

**OpenCompilers Hub** es un blog técnico y educativo de alto nivel dedicado a la arquitectura e ingeniería de los **compiladores de código abierto** más influyentes del mundo: **LLVM, GCC, rustc, V8 (JIT), Zig y más**.

Desarrollado con una estética moderna, ingeniería de interfaces (Glassmorphism, Dark/Light theme) y animaciones interactivas, todo implementado en **HTML5, CSS3 y JavaScript Vanilla** (sin dependencias externas pesadas).

---

## 🌟 Características Destacadas

- **Interactive AST Canvas Hero:** Fondo interactivo en tiempo real que simula un árbol de sintaxis abstracta y red de dependencias que responde dinámicamente al cursor del ratón.
- **Simulador Interactivo de Pipeline de Compilación:** Explora las 7 fases de compilación (Código Fuente, Lexer, Parser AST, Análisis Semántico, LLVM IR SSA, Optimizador -O3 y Ensamblador x86-64) con transformación de código en vivo y resaltado sintáctico.
- **Modo Oscuro / Modo Claro:** Sistema de temas con transiciones suaves y persistencia en `localStorage`.
- **Artículos Técnicos Detallados:** Publicaciones rigurosas sobre LLVM, GCC, el Borrow Checker de Rust, motores JIT en la web, transpiladores en Rust/Go (SWC/esbuild) y Tiny C Compiler (TCC).
- **Lector en Modal Completo:** Interfaz de lectura sin distracciones, soporte para tecla Escape, barra de progreso y botón para compartir.
- **Matriz Comparativa:** Tabla comparativa técnica de compiladores, licencias, lenguajes base y representaciones intermedias.
- **Filtros y Búsqueda en Tiempo Real:** Filtrado instantáneo por texto y chips de categoría.
- **Favoritos (Bookmarks) & Likes:** Sistema de guardado y votación interactiva persistida en el navegador.

---

## 📂 Estructura del Proyecto

```plaintext
COMPILADORES/
├── index.html               # Página web principal
├── README.md                # Documentación del proyecto
├── server.ps1               # Servidor HTTP local nativo en PowerShell
├── iniciar_servidor.bat     # Lanzador de un solo clic con apertura en Brave Browser
├── css/
│   └── styles.css           # Sistema de diseño, variables CSS y animaciones
├── js/
│   ├── articles-data.js     # Datos de artículos, comparativa y pipeline
│   ├── pipeline-simulator.js# Lógica interactiva de las 7 fases de compilación
│   └── app.js               # Lógica general (canvas, filtros, modal, bookmarks, tema)
└── .vscode/
    └── launch.json          # Configuración para depurar y lanzar con Brave Browser
```

---

## 🚀 Cómo Ejecutar Localmente

### Opción 1: Lanzador Rápido (Recomendado)
Haz doble clic sobre el archivo `iniciar_servidor.bat`. Levantará el servidor en `http://localhost:8080/` y abrirá automáticamente tu navegador **Brave**.

### Opción 2: PowerShell
Ejecuta el script del servidor:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
```
Y abre tu navegador en `http://localhost:8080/`.

### Opción 3: Abrir directamente el archivo HTML
Abre `index.html` directamente con cualquier navegador web.

---

## 📜 Licencia
Este proyecto está bajo la Licencia **MIT**. Consulta libre y abierta para propósitos educativos y de investigación.
