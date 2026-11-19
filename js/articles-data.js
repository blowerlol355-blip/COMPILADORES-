// Base de datos de artículos para el blog de Compiladores de Código Abierto
const ARTICLES_DATA = [
  {
    id: "llvm-clang-arquitectura",
    title: "LLVM y Clang: La Revolución de la Arquitectura de Compiladores Modulares",
    slug: "llvm-clang-arquitectura-modular",
    category: "sistemas",
    categoryLabel: "Sistemas & Infraestructura",
    date: "14 Nov, 2026",
    readTime: "7 min de lectura",
    author: {
      name: "Ing. Carlos Mendoza",
      role: "Especialista en Toolchains & SSA",
      avatar: "CM"
    },
    featured: true,
    excerpt: "Descubre cómo LLVM transformó la industria de los compiladores al desacoplar el Frontend, el Optimizador y el Backend a través de su Representación Intermedia (LLVM IR).",
    tags: ["LLVM", "Clang", "SSA", "C++", "Optimizaciones"],
    likes: 142,
    content: `
      <h2>1. El problema de los compiladores monolíticos tradicionales</h2>
      <p>Históricamente, construir un compilador para un nuevo lenguaje de programación significaba reescribir todo desde cero: el analizador léxico/sintáctico, la máquina de optimización y los generadores de código de máquina para cada arquitectura (x86, ARM, PowerPC). Si tenías <em>N</em> lenguajes y <em>M</em> arquitecturas, requerías desarrollar <em>N &times; M</em> compiladores completos.</p>
      
      <p>Chris Lattner y Vikram Adve en la Universidad de Illinois (2000) concibieron <strong>LLVM</strong> (inicialmente <em>Low Level Virtual Machine</em>) con una premisa audaz: <strong>modularidad total mediante un lenguaje intermedio universal</strong>.</p>

      <div class="code-box">
        <div class="code-header">
          <span>Ejemplo de LLVM IR (.ll) para una función suma</span>
          <button class="copy-btn" onclick="copyCodeSnippet(this)">Copiar</button>
        </div>
        <pre><code class="language-llvm">define i32 @sumar(i32 %a, i32 %b) {
entry:
  ; Operación de suma en forma SSA (Single Static Assignment)
  %resultado = add nsw i32 %a, %b
  ret i32 %resultado
}</code></pre>
      </div>

      <h2>2. La tríada arquitectónica de LLVM</h2>
      <p>El éxito arrollador de LLVM reside en su división limpia de responsabilidades:</p>
      <ul>
        <li><strong>Frontend (ej. Clang, rustc, swiftc):</strong> Analiza el código fuente (C, C++, Rust, Swift), genera el Árbol de Sintaxis Abstracta (AST), realiza validación semántica y emite <em>LLVM IR</em>.</li>
        <li><strong>Optimizador (opt):</strong> Realiza cientos de pases de optimización agnósticos de la plataforma sobre el LLVM IR (eliminación de código muerto, desenrollado de bucles, vectorización SIMD, inlining).</li>
        <li><strong>Backend (llc):</strong> Transforma el LLVM IR optimizado en código ensamblador nativo para arquitecturas específicas (x86-64, AArch64, RISC-V, WebAssembly, etc.).</li>
      </ul>

      <blockquote>
        "LLVM demostró que un lenguaje intermedio bien tipado y en formato SSA puede servir simultáneamente para optimización en tiempo de compilación, en tiempo de enlace (LTO) y en tiempo de ejecución (JIT)."
      </blockquote>

      <h2>3. Clang: El Frontend de alto rendimiento</h2>
      <p>Antes de Clang, los errores en compiladores C++ eran crípticos y lentos de emitir. Clang se diseñó como una biblioteca con:</p>
      <ul>
        <li>Mensajes de error expresivos con marcas visuales de columna y sugerencias directas (<em>Fix-its</em>).</li>
        <li>Arquitectura de AST completa preservando comentarios y formato, ideal para herramientas como <code>clang-format</code>, <code>clang-tidy</code> y servidores de lenguaje (LSP como <code>clangd</code>).</li>
        <li>Tiempos de compilación significativamente inferiores a compiladores antiguos.</li>
      </ul>

      <h2>4. ¿Por qué es el estándar de facto hoy?</h2>
      <p>Empresas como Apple, Google, Sony, Intel y la fundación Mozilla adoptaron LLVM. Es el backend oficial de Rust, Swift, Julia, Zig y Kotlin/Native. Su licencia permisiva Apache 2.0 con LLVM Exceptions permite su adopción tanto en proyectos de código abierto como en herramientas propietarias para consolas de videojuegos y aceleradores de IA (como MLIR).</p>
    `
  },
  {
    id: "gcc-35-anos-historia",
    title: "GCC: Más de 35 años impulsando la soberanía del Software Libre",
    slug: "gcc-historia-gimple-rtl",
    category: "sistemas",
    categoryLabel: "Sistemas & Infraestructura",
    date: "10 Nov, 2026",
    readTime: "9 min de lectura",
    author: {
      name: "Dra. Elena Valenzuela",
      role: "Investigadora en Sistemas Operativos",
      avatar: "EV"
    },
    featured: false,
    excerpt: "Un recorrido técnico por la GNU Compiler Collection: desde su concepción por Richard Stallman hasta sus etapas internas GENERIC, GIMPLE y RTL.",
    tags: ["GCC", "GNU", "GIMPLE", "RTL", "Linux", "C"],
    likes: 98,
    content: `
      <h2>1. El origen que cambió la informática</h2>
      <p>En 1987, Richard Stallman lanzó la primera versión de <strong>GCC (GNU C Compiler)</strong> con el objetivo fundamental de permitir la existencia de un sistema operativo 100% libre (GNU/Linux). Con el tiempo, se expandió para soportar múltiples lenguajes (C++, Fortran, Ada, Go, D), transformando sus siglas en <strong>GNU Compiler Collection</strong>.</p>

      <h2>2. El Pipeline interno de GCC</h2>
      <p>A diferencia del enfoque de LLVM, GCC desarrolló su propia jerarquía de representaciones intermedias que ha madurado a lo largo de décadas:</p>
      <ol>
        <li><strong>GENERIC:</strong> Representación de árbol que contiene todo el programa tras el análisis sintáctico de cada frontend.</li>
        <li><strong>GIMPLE:</strong> Una versión simplificada de tres direcciones de GENERIC. No contiene bucles complejos ni expresiones anidadas; todo se descompone en asignaciones de no más de tres operandos. Sobre GIMPLE se ejecutan las optimizaciones de SSA (Static Single Assignment).</li>
        <li><strong>RTL (Register Transfer Language):</strong> Una representación intermedia de muy bajo nivel inspirada en LISP que modela una máquina con registros infinitos. Es donde GCC aplica optimizaciones específicas de hardware como el *instruction scheduling* y la asignación óptima de registros físicos.</li>
      </ol>

      <div class="code-box">
        <div class="code-header">
          <span>Fragmento conceptual de instrucción RTL en GCC</span>
          <button class="copy-btn" onclick="copyCodeSnippet(this)">Copiar</button>
        </div>
        <pre><code class="language-lisp">(insn 8 7 9 2 (set (reg:SI 60 [ _1 ])
        (plus:SI (reg/v:SI 59 [ a ])
            (reg/v:SI 61 [ b ]))) "test.c":2:10 -1
     (nil))</code></pre>
      </div>

      <h2>3. Robustez sin rival en arquitecturas exóticas</h2>
      <p>Mientras que LLVM brilla en arquitecturas modernas y herramientas de desarrollo, GCC sigue siendo insuperable en la cantidad de arquitecturas soportadas: microcontroladores AVR, SPARC, Alpha, s390x, RISC-V y microprocesadores embebidos históricos. El Kernel Linux y la suite GNU siguen confiando prioritariamente en GCC por su confiabilidad demostrada durante décadas.</p>
    `
  },
  {
    id: "rustc-borrow-checker-mir",
    title: "Bajo el capó de rustc: ¿Cómo valida el Borrow Checker el código sin GC?",
    slug: "rustc-borrow-checker-mir-hir",
    category: "sistemas",
    categoryLabel: "Nuevos Paradigmas",
    date: "06 Nov, 2026",
    readTime: "8 min de lectura",
    author: {
      name: "Mateo Sotomayor",
      role: "Rust Core Contributor enthusiast",
      avatar: "MS"
    },
    featured: false,
    excerpt: "Analizamos cómo el compilador de Rust transforma el código fuente a través de HIR y MIR para verificar préstamos, mutabilidad y ciclos de vida sin recolector de basura.",
    tags: ["Rust", "rustc", "MIR", "Borrow Checker", "Seguridad"],
    likes: 185,
    content: `
      <h2>1. El dilema de la gestión de memoria</h2>
      <p>Durante décadas la informática se dividió en dos mundos: control manual propenso a fallas catastróficas (C/C++ con <em>use-after-free</em>, <em>double free</em>, fugas de memoria) o seguridad mediante recolectores de basura automáticos con pausas de ejecución (Java, Go, C#).</p>
      <p>Rust introdujo el concepto de <strong>Ownership (Propiedad)</strong> verificado en tiempo de compilación. Y el responsable de esta hazaña es <strong>rustc</strong>.</p>

      <h2>2. Las representaciones intermedias de rustc</h2>
      <p>Para lograr verificar reglas complejas sin ralentizar la compilación más de lo necesario, rustc pasa por varias fases:</p>
      <ul>
        <li><strong>AST (Abstract Syntax Tree):</strong> Generado tras el parseo y macro-expansión.</li>
        <li><strong>HIR (High-Level Intermediate Representation):</strong> AST desazucarado donde se realiza la resolución de tipos y firmas.</li>
        <li><strong>MIR (Mid-Level Intermediate Representation):</strong> Un grafo de flujo de control (CFG) basado en asignaciones simples. Es aquí donde ocurre la magia del <strong>Borrow Checker</strong> (Non-Lexical Lifetimes o NLL).</li>
      </ul>

      <div class="code-box">
        <div class="code-header">
          <span>Ejemplo de validación de propiedad en Rust</span>
          <button class="copy-btn" onclick="copyCodeSnippet(this)">Copiar</button>
        </div>
        <pre><code class="language-rust">fn main() {
    let s1 = String::from("compiladores");
    let s2 = s1; // Movimiento de propiedad (Move semantics)
    
    // ERROR en compilación: rustc detecta en MIR que s1 ya no es válido
    // println!("{}", s1); 
    println!("{}", s2); // Correcto
}</code></pre>
      </div>

      <h2>3. Polonius: La próxima evolución del validador de préstamos</h2>
      <p>El equipo de rustc está desarrollando <strong>Polonius</strong>, una formulación del borrow checker basada en programación lógica (Datalog). Polonius analiza los orígenes de las referencias de forma más granular, aceptando código perfectamente seguro que el actual validador aún rechaza por precaución conservadora.</p>
    `
  },
  {
    id: "motores-jit-v8-spidermonkey",
    title: "Compilación JIT en la Web: V8 (Chrome) y SpiderMonkey (Firefox)",
    slug: "motores-jit-v8-spidermonkey-turbofan",
    category: "jit",
    categoryLabel: "JIT & Web",
    date: "02 Nov, 2026",
    readTime: "6 min de lectura",
    author: {
      name: "Lucía Paredes",
      role: "Web Engines & V8 Performance Engineer",
      avatar: "LP"
    },
    featured: false,
    excerpt: "Comprende cómo los compiladores Just-In-Time convierten JavaScript dinámico en código máquina hiperoptimizado en milisegundos usando Ignition y TurboFan.",
    tags: ["JIT", "V8", "SpiderMonkey", "JavaScript", "TurboFan"],
    likes: 120,
    content: `
      <h2>1. El desafío del lenguaje dinámico</h2>
      <p>JavaScript carece de tipos estáticos explícitos. Una función como <code>function sumar(a, b) { return a + b; }</code> puede recibir enteros, flotantes, strings o incluso objetos con métodos <code>valueOf</code> sobrecargados. Compilar esto de forma eficiente requiere <strong>Optimización Especulativa en Tiempo de Ejecución (JIT)</strong>.</p>

      <h2>2. El pipeline por niveles de V8</h2>
      <p>El motor V8 de Google utiliza un pipeline multinivel (Tiered Compilation):</p>
      <ul>
        <li><strong>Ignition (Intérprete de Bytecode):</strong> Arranca de inmediato. Lee el AST y ejecuta bytecode compacto consumiendo muy poca memoria, mientras recopila información de perfilado (<em>Type Feedback</em>).</li>
        <li><strong>Sparkplug (Compilador no optimizador rápido):</strong> Genera código máquina directo a partir del bytecode sin optimizaciones complejas para acelerar funciones de uso medio.</li>
        <li><strong>TurboFan (Compilador optimizador JIT):</strong> Toma las funciones identificadas como "Hot" (ejecutadas repetidamente). Asume que los tipos observados por Ignition continuarán siendo los mismos y genera ensamblador x86/ARM ultra eficiente utilizando una representación llamada <em>Sea of Nodes</em>.</li>
      </ul>

      <blockquote>
        "Si una función optimizada por TurboFan recibe repentinamente un string cuando esperaba números enteros, ocurre una <strong>Desoptimización (Deopt)</strong>: V8 descarta el código máquina optimizado y vuelve de inmediato a Ignition sin romper la ejecución."
      </blockquote>

      <h2>3. SpiderMonkey y el motor IonMonkey</h2>
      <p>Firefox utiliza SpiderMonkey con su propio esquema multicapa: el intérprete C++, seguido de <em>Baseline Interpreter</em>, <em>Baseline Compiler</em> y finalmente <em>IonMonkey / WarpMonkey</em>. La competencia abierta entre estos dos proyectos ha multiplicado la velocidad de JavaScript en más de un 1000% en la última década.</p>
    `
  },
  {
    id: "zig-zld-toolchains",
    title: "Zig y ZLD: Reimaginando la compilación en C/C++ sin dependencias externas",
    slug: "zig-toolchains-cross-compilation",
    category: "paradigmas",
    categoryLabel: "Nuevos Paradigmas",
    date: "28 Oct, 2026",
    readTime: "7 min de lectura",
    author: {
      name: "Ing. Carlos Mendoza",
      role: "Especialista en Toolchains & SSA",
      avatar: "CM"
    },
    featured: false,
    excerpt: "¿Por qué Zig se está convirtiendo en el mejor compilador de C y C++ del mundo? Descubre la magia de zig cc y la compilación cruzada instantánea.",
    tags: ["Zig", "C++", "Linkers", "Cross-Compile", "Clang"],
    likes: 167,
    content: `
      <h2>1. La pesadilla de la compilación cruzada tradicional</h2>
      <p>Configurar un entorno para compilar código C/C++ en Linux con destino a Windows (MinGW) o ARM embebido tradicionalmente requería descargar toolchains gigantescos, configurar sysroots y lidiar con versiones incompatibles de <code>glibc</code>.</p>
      <p>Andrew Kelley, creador de <strong>Zig</strong>, resolvió esto integrando las bibliotecas estándar C (musl, glibc y mingw-w64) directamente en el ejecutable del compilador Zig.</p>

      <div class="code-box">
        <div class="code-header">
          <span>Compilar C para Windows desde Linux con un solo comando</span>
          <button class="copy-btn" onclick="copyCodeSnippet(this)">Copiar</button>
        </div>
        <pre><code class="language-bash"># ¡Sin instalar MinGW ni máquinas virtuales!
zig cc main.c -target x86_64-windows-gnu -o programa.exe</code></pre>
      </div>

      <h2>2. ZLD: Enlazadores hiperrápidos</h2>
      <p>Uno de los mayores cuellos de botella en compilaciones gigantescas en C++ es el enlazado (<em>linking</em>). Zig implementó su propio linker incremental escrito desde cero, reduciendo tiempos de enlace de decenas de segundos a fracciones de segundo.</p>

      <h2>3. Comptime: Adiós a las macros del preprocesador</h2>
      <p>En Zig no hay preprocesador C ni macros complejas. Cualquier función regular puede ejecutarse en tiempo de compilación antecediendo la palabra clave <code>comptime</code>. El propio compilador incluye un intérprete interno que evalúa el código antes de emitir la salida final.</p>
    `
  },
  {
    id: "transpiladores-swc-esbuild",
    title: "SWC y esbuild: La era de los compiladores frontend escritos en Rust y Go",
    slug: "swc-esbuild-rust-go-transpiladores",
    category: "transpiladores",
    categoryLabel: "Transpiladores",
    date: "22 Oct, 2026",
    readTime: "5 min de lectura",
    author: {
      name: "Lucía Paredes",
      role: "Web Engines & V8 Performance Engineer",
      avatar: "LP"
    },
    featured: false,
    excerpt: "Cómo la migración de herramientas de JavaScript (Babel) a lenguajes compilados con paralelismo nativo (Rust y Go) multiplicó la velocidad de transpilación por 20x-100x.",
    tags: ["SWC", "esbuild", "Rust", "Go", "Babel", "Bundlers"],
    likes: 114,
    content: `
      <h2>1. El límite de rendimiento de Babel</h2>
      <p>Babel fue el pilar que permitió a JavaScript evolucionar usando características modernas de ES6+ en navegadores antiguos. Sin embargo, al estar escrito en JavaScript puro sobre Node.js, sufre de limitaciones de memoria, pausas del Garbage Collector y ejecución monohilo en el parsing de grandes codebases.</p>

      <h2>2. esbuild: La revelación en Go</h2>
      <p>Evan Wallace creó <strong>esbuild</strong> en Go con un diseño que prioriza el paralelismo absoluto: el parser procesa archivos concurrentemente en todos los núcleos de la CPU, evitando estructuras de datos innecesarias y maximizando la localidad de caché. El resultado: builds de minutos reducidos a milisegundos.</p>

      <h2>3. SWC: La potencia de Rust en Next.js</h2>
      <p>Creado por DongYoon Kang, <strong>SWC (Speedy Web Compiler)</strong> implementó la arquitectura de Babel en Rust. Adoptado por Next.js, Deno y Vite, SWC ofrece transpilación, minificación y empaquetado hasta 70 veces más veloz que las soluciones previas basadas en Node.js.</p>
    `
  },
  {
    id: "tcc-fabrice-bellard",
    title: "Tiny C Compiler (TCC): Cómo compilar C instantáneamente en menos de 100 KB",
    slug: "tcc-tiny-c-compiler-fabrice-bellard",
    category: "teoria",
    categoryLabel: "Teoría & Fases",
    date: "15 Oct, 2026",
    readTime: "6 min de lectura",
    author: {
      name: "Dra. Elena Valenzuela",
      role: "Investigadora en Sistemas Operativos",
      avatar: "EV"
    },
    featured: false,
    excerpt: "La genialidad minimalista de Fabrice Bellard: un compilador C completo que cabe en un disquete, compila en un solo paso y puede usarse como intérprete de scripts C.",
    tags: ["TCC", "C", "Minimalismo", "Fabrice Bellard", "Compilación Rápida"],
    likes: 139,
    content: `
      <h2>1. La obra maestra minimalista de Fabrice Bellard</h2>
      <p>En el mundo moderno donde compiladores como GCC o Clang pesan cientos de megabytes y requieren gigabytes de RAM para compilar proyectos grandes, <strong>TCC (Tiny C Compiler)</strong> es un milagro de eficiencia: un compilador C99 completo cuyo binario pesa menos de 100 KB.</p>

      <h2>2. Arquitectura de un solo paso (One-Pass Compiler)</h2>
      <p>TCC no construye representaciones intermedias pesadas como GIMPLE o LLVM IR. Genera código de máquina directamente a medida que analiza los tokens en un solo paso:</p>
      <ul>
        <li>Velocidad descomunal: Compila miles de líneas por segundo, siendo virtualmente instantáneo.</li>
        <li>Generación directa en memoria: Puede compilar código C y ejecutarlo inmediatamente en RAM sin siquiera escribir un archivo ejecutable en disco.</li>
        <li>Soporta la directiva <code>#! /usr/bin/tcc -run</code> permitiendo ejecutar programas C como si fuesen scripts de Python o Bash.</li>
      </ul>

      <h2>3. Lecciones pedagógicas de TCC</h2>
      <p>Para estudiantes e investigadores de ciencias de la computación, el código fuente de TCC es una de las lecturas más enriquecedoras del software libre: demuestra cómo implementar un preprocesador, un parser de descenso recursivo y un generador x86 en un código legible y elegante.</p>
    `
  },
  {
    id: "ghc-compilacion-haskell",
    title: "GHC: Optimización matemática y la máquina abstracta STG en Haskell",
    slug: "ghc-compilador-haskell-stg",
    category: "paradigmas",
    categoryLabel: "Nuevos Paradigmas",
    date: "09 Oct, 2026",
    readTime: "8 min de lectura",
    author: {
      name: "Mateo Sotomayor",
      role: "Rust Core Contributor enthusiast",
      avatar: "MS"
    },
    featured: false,
    excerpt: "¿Cómo se compila un lenguaje puramente funcional con evaluación perezosa (lazy)? Conoce GHC, Core y la máquina STG (Spineless Tagless G-machine).",
    tags: ["Haskell", "GHC", "STG", "Funcional", "Tipos"],
    likes: 89,
    content: `
      <h2>1. Compilar la pureza y la pereza</h2>
      <p>Haskell es un lenguaje declarativo puro y perezoso: las expresiones no se calculan hasta que su resultado es estrictamente necesario. Compilar esto eficientemente a arquitecturas von Neumann convencionales requiere transformaciones que parecen más demostraciones matemáticas que compilación estándar.</p>

      <h2>2. El Pipeline de GHC</h2>
      <p>El <strong>Glasgow Haskell Compiler (GHC)</strong> utiliza un pipeline sofisticado:</p>
      <ol>
        <li><strong>Haskell Source &rarr; Desugarer:</strong> Reduce la rica sintaxis de Haskell al cálculo lambda tipado conocido como <strong>GHC Core</strong> (System Fw).</li>
        <li><strong>Core-to-Core Passes:</strong> Se aplican decenas de transformaciones algebraicas: inlining, análisis de estrictez (strictness analysis) y reglas de reescritura definidas por el usuario.</li>
        <li><strong>STG (Spineless Tagless G-machine):</strong> Modelo operacional abstracto que formaliza cómo se crean y evalúan los grafos de *thunks* (cálculos diferidos).</li>
        <li><strong>Cmm & Codegen:</strong> Cmm es un dialecto intermedio tipo C-- que finalmente se compila a código nativo mediante backend propio o a través de LLVM.</li>
      </ol>
    `
  }
];

// Datos para la tabla comparativa de compiladores
const COMPILER_COMPARISON_DATA = [
  {
    name: "LLVM / Clang",
    creator: "Chris Lattner / Vikram Adve",
    license: "Apache 2.0 (LLVM Exceptions)",
    writtenIn: "C++",
    ir: "LLVM IR (SSA tipado)",
    targetSupport: "x86, ARM, RISC-V, WebAssembly, GPU...",
    specialty: "Modularidad, optimizaciones LTO, diagnósticos amigables"
  },
  {
    name: "GCC",
    creator: "Richard Stallman (FSF)",
    license: "GPLv3+",
    writtenIn: "C / C++",
    ir: "GENERIC &rarr; GIMPLE &rarr; RTL",
    targetSupport: "Más de 60 arquitecturas nativas y embebidas",
    specialty: "Soberanía de software libre, fiabilidad industrial en Linux"
  },
  {
    name: "rustc",
    creator: "Graydon Hoare / Mozilla Foundation",
    license: "MIT o Apache 2.0",
    writtenIn: "Rust (Autoalojado)",
    ir: "HIR &rarr; MIR &rarr; LLVM IR",
    targetSupport: "Todas las soportadas por LLVM",
    specialty: "Borrow Checker, seguridad de memoria estática sin GC"
  },
  {
    name: "V8 (JIT)",
    creator: "Lars Bak / Google",
    license: "BSD-3-Clause",
    writtenIn: "C++",
    ir: "Ignition Bytecode &rarr; Sea of Nodes (TurboFan)",
    targetSupport: "x86, x64, ARM, ARM64, MIPS, RISC-V",
    specialty: "Compilación JIT adaptativa, optimización especulativa"
  },
  {
    name: "Zig (zig cc)",
    creator: "Andrew Kelley",
    license: "MIT",
    writtenIn: "Zig / C++",
    ir: "ZIR &rarr; AIR &rarr; LLVM / Backend propio",
    targetSupport: "x86, AArch64, RISC-V, WASM, etc.",
    specialty: "Compilación cruzada instantánea, reemplazo drop-in de C/C++"
  },
  {
    name: "TCC",
    creator: "Fabrice Bellard",
    license: "LGPL 2.1",
    writtenIn: "C",
    ir: "Sin IR pesado (One-pass directo a máquina)",
    targetSupport: "x86, x86-64, ARM, RISC-V",
    specialty: "Velocidad instantánea, ejecutable < 100KB, modo C script"
  }
];

// Datos del Simulador de Pipeline de Compilación interactivo
const PIPELINE_STAGES = [
  {
    id: "source",
    title: "1. Código Fuente",
    subtitle: "Entrada en lenguaje de alto nivel",
    description: "El programador escribe código legible para humanos. En este ejemplo, una función matemática en un lenguaje de tipado estático.",
    codeSnippet: `int calcular_total(int base, int tasa) {
    int extra = 10;
    int resultado = (base + extra) * tasa;
    return resultado;
}`,
    language: "c",
    insight: "El compilador recibe este archivo como una secuencia plana de caracteres UTF-8 o ASCII."
  },
  {
    id: "lexer",
    title: "2. Análisis Léxico (Scanner)",
    subtitle: "Conversión de caracteres en Tokens",
    description: "El Lexer descarta espacios en blanco y comentarios, agrupando secuencias de caracteres en unidades atómicas con significado: Tokens (identificadores, palabras clave, literales, operadores).",
    codeSnippet: `[KEYWORD, "int"]
[IDENTIFIER, "calcular_total"]
[PUNCTUATION, "("]
[KEYWORD, "int"] [IDENTIFIER, "base"] [PUNCTUATION, ","]
[KEYWORD, "int"] [IDENTIFIER, "tasa"]
[PUNCTUATION, ")"] [PUNCTUATION, "{"]
[KEYWORD, "int"] [IDENTIFIER, "extra"] [OPERATOR, "="] [LITERAL_INT, 10] [PUNCTUATION, ";"]
[KEYWORD, "int"] [IDENTIFIER, "resultado"] [OPERATOR, "="]
  [PUNCTUATION, "("] [IDENTIFIER, "base"] [OPERATOR, "+"] [IDENTIFIER, "extra"] [PUNCTUATION, ")"]
  [OPERATOR, "*"] [IDENTIFIER, "tasa"] [PUNCTUATION, ";"]
[KEYWORD, "return"] [IDENTIFIER, "resultado"] [PUNCTUATION, ";"]
[PUNCTUATION, "}"]`,
    language: "json",
    insight: "Herramientas clásicas: Flex, Lex. Herramientas modernas: parsers manuales o logos (Rust)."
  },
  {
    id: "parser",
    title: "3. Análisis Sintáctico (AST)",
    subtitle: "Árbol de Sintaxis Abstracta",
    description: "El Parser verifica que la secuencia de tokens cumpla la gramática formal del lenguaje (BNF/EBNF) y construye una estructura jerárquica en árbol que refleja las relaciones de precedencia.",
    codeSnippet: `FunctionDeclaration: calcular_total
├── ReturnType: int
├── Parameters: [base: int, tasa: int]
└── Body (Block):
    ├── VarDecl: extra = 10 (int)
    ├── VarDecl: resultado = BinaryExpr (*)
    │   ├── Left (Group): BinaryExpr (+)
    │   │   ├── Left: Identifier (base)
    │   │   └── Right: Identifier (extra)
    │   └── Right: Identifier (tasa)
    └── ReturnStmt: Identifier (resultado)`,
    language: "yaml",
    insight: "Algoritmos comunes: Descenso Recursivo con precedencia de Pratt, LL(k), LR(1), LALR (Bison/Yacc)."
  },
  {
    id: "semantic",
    title: "4. Análisis Semántico",
    subtitle: "Tabla de Símbolos y Comprobación de Tipos",
    description: "El compilador valida el sentido lógico: que las variables estén declaradas antes de su uso, que no se sume un string con un puntero incompatible, que el valor de retorno coincida y reglas de visibilidad.",
    codeSnippet: `=== TABLA DE SÍMBOLOS (Scope: Function calcular_total) ===
- base      : Tipo = i32, Offset = +8,  Inicializado = SI
- tasa      : Tipo = i32, Offset = +12, Inicializado = SI
- extra     : Tipo = i32, Offset = -4,  Inicializado = SI (Constante: 10)
- resultado : Tipo = i32, Offset = -8,  Inicializado = SI

=== VALIDACIÓN DE TIPOS ===
✓ TypeCheck: Operador (+) con operandos (i32, i32) -> Resultado: i32
✓ TypeCheck: Operador (*) con operandos (i32, i32) -> Resultado: i32
✓ ReturnCheck: Expresión evaluada a i32 coincide con firma 'int'`,
    language: "text",
    insight: "En Rust, aquí también se calculan las restricciones de ciclo de vida (Lifetimes) y de préstamos."
  },
  {
    id: "ir",
    title: "5. Código Intermedio (IR / SSA)",
    subtitle: "Representación lineal independiente de CPU",
    description: "El AST se transforma en una forma intermedia como LLVM IR o GIMPLE en formato SSA (Single Static Assignment), donde cada variable temporal se asigna exactamente una sola vez.",
    codeSnippet: `; LLVM IR generado
define i32 @calcular_total(i32 %base, i32 %tasa) {
entry:
  %extra = add nsw i32 10, 0
  %temp1 = add nsw i32 %base, 10
  %resultado = mul nsw i32 %temp1, %tasa
  ret i32 %resultado
}`,
    language: "llvm",
    insight: "El formato SSA simplifica enormemente las optimizaciones matemáticas y el análisis de flujo de datos."
  },
  {
    id: "opt",
    title: "6. Optimizador (Passes)",
    subtitle: "Transformaciones para máxima eficiencia",
    description: "Se aplican optimizaciones independientes del hardware: propagación de constantes, eliminación de código muerto (DCE), vectorización y simplificación de expresiones algebraicas.",
    codeSnippet: `; LLVM IR tras el pase 'opt -O3'
define i32 @calcular_total(i32 %base, i32 %tasa) {
entry:
  ; La variable extra fue colapsada (Constant Folding)
  ; y reordenada para aprovechar instrucciones vectoriales o fused-multiply-add
  %1 = add i32 %base, 10
  %2 = mul i32 %1, %tasa
  ret i32 %2
}`,
    language: "llvm",
    insight: "LLVM cuenta con más de 150 pases de optimización que transforman el código recursivamente."
  },
  {
    id: "codegen",
    title: "7. Generador de Código Máquina",
    subtitle: "Ensamblador para la arquitectura destino (x86_64)",
    description: "El Backend asigna registros físicos reales de la CPU (RDI, RSI, EAX), agenda las instrucciones para minimizar ciclos de espera y emite código ensamblador nativo o binario ELF/Mach-O/PE.",
    codeSnippet: `calcular_total:
    .cfi_startproc
    ; %edi = base, %esi = tasa
    lea     eax, [rdi + 10]   ; eax = base + 10 (instrucción LEA ultra rápida)
    imul    eax, esi          ; eax = eax * tasa
    ret                       ; Retorna el resultado en el registro eax
    .cfi_endproc`,
    language: "nasm",
    insight: "¡Observa cómo transformó la suma en una sola instrucción 'lea' antes de multiplicar y retornar!"
  }
];

