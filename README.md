# Lanza Castelli · Vista previa

Propuesta visual de la escribanía, preparada para editar entre dos personas y subir a GitHub. HTML, CSS y JavaScript nativo, con las 14 imágenes originales. No requiere instalar paquetes ni compilar.

## Qué editar

| Archivo                 | Contenido                                                        |
| ----------------------- | ---------------------------------------------------------------- |
| `index.html`            | Textos, secciones, enlaces y datos de contacto.                  |
| `assets/css/styles.css` | Colores, tipografías, espaciados y diseño responsive.            |
| `assets/js/main.js`     | Menú móvil, galería, navegación y animaciones.                   |
| `assets/img/`           | Logo, fotografías e iconos originales, con nombres descriptivos. |
| `.editorconfig`         | Sangría y formato comunes para los editores compatibles.         |
| `.gitattributes`        | Saltos de línea consistentes entre Windows, macOS y Linux.       |
| `.gitignore`            | Exclusión de archivos temporales y configuración local.          |
| `.nojekyll`             | Publicación de los archivos estáticos en GitHub Pages.           |

## Ver la página

Descomprimí el ZIP y abrí `index.html` en tu navegador. Conservá la carpeta `assets` junto al HTML.

Si preferís verla con un servidor local y tenés Python 3, ejecutá este comando desde la carpeta del proyecto:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

En Windows también podés usar `py -m http.server 8000 --bind 127.0.0.1`. Abrí `http://localhost:8000` y detené el servidor con `Ctrl+C`.

## Subir a GitHub

1. Creá un repositorio, por ejemplo `lanza-castelli`. Elegí su visibilidad según quién deba acceder al código.
2. Descomprimí `lanza-castelli-github.zip`.
3. En GitHub, usá **Add file → Upload files**; en un repositorio vacío también aparece el enlace para subir archivos existentes.
4. Subí **el contenido** de la carpeta descomprimida, incluidos los archivos que empiezan con punto. `index.html` y `assets` deben quedar en la raíz del repositorio, sin una carpeta adicional alrededor. El ZIP se descomprime antes de subirlo.
5. Guardá el primer cambio en `main`.

Si usás Git desde la terminal, ejecutá lo siguiente dentro de la carpeta descomprimida, reemplazando `TU_USUARIO` y el nombre del repositorio. Para esta opción, creá el repositorio remoto vacío, sin README ni licencia inicial:

```bash
git init -b main
git add .
git commit -m "Preparar vista previa de Lanza Castelli"
git remote add origin https://github.com/TU_USUARIO/lanza-castelli.git
git push -u origin main
```

## Trabajar con tu socio

En el repositorio personal, entrá en **Settings → Collaborators → Add people**, buscá su usuario y enviá la invitación. Tu socio debe aceptarla. [Instrucciones de GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/inviting-collaborators-to-a-personal-repository).

Cada uno puede editar desde GitHub o clonar el repositorio en su computadora. Para revisar los cambios entre ustedes, creen una rama por tarea, por ejemplo `mejora-menu`, y abran un **pull request** hacia `main`. El otro puede revisar la propuesta antes de integrarla. Estas son convenciones de trabajo; el paquete no configura restricciones de ramas en GitHub.

Con Git, después de clonar y antes de comenzar una tarea:

```bash
git switch main
git pull --ff-only
git switch -c mejora-menu
```

Después de editar y revisar la página:

```bash
git add index.html assets/
git commit -m "Mejorar el menú móvil"
git push -u origin mejora-menu
```

Abrí el pull request desde GitHub. Usá otro nombre de rama para cada tarea y actualizá `main` después de integrar los cambios.

## Publicar una vista previa con GitHub Pages (opcional)

Subir el código permite colaborar; activar Pages permite abrir la web mediante una URL.

1. En **Settings → Pages**, elegí **Deploy from a branch**.
2. Seleccioná la rama `main` y la carpeta `/(root)`.
3. Guardá y esperá a que GitHub complete la publicación. La URL aparecerá en esa misma sección.

Los siguientes cambios integrados en `main` actualizarán la web. No hace falta un workflow propio ni un proceso de compilación. Con GitHub Free, Pages está disponible para repositorios públicos; los privados requieren un plan compatible. Activar Pages normalmente hace pública la web aunque el código sea privado. [Configuración y disponibilidad de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Estado de esta propuesta

Se conserva el diseño de `lanza-castelli-preview-premium.html`, separado en archivos editables. Para futuros cambios, trabajen sobre `index.html` y `assets/`: las copias HTML originales no se sincronizan automáticamente con este proyecto.

El formulario sigue siendo ilustrativo y no envía ni guarda consultas. El mapa es ilustrativo y las redes conservan sus enlaces desactivados. La página mantiene su identificación como vista previa y la indicación `noindex,nofollow`. No hay backend, analítica ni servicios externos conectados.

Se comprobaron la estructura del HTML, las rutas locales, la integridad de las imágenes y la sintaxis del JavaScript. La revisión visual en navegador sigue pendiente por una restricción del entorno de preparación. Antes de integrar cambios de diseño, revisen el menú, la galería y las secciones en escritorio y móvil, especialmente en los anchos 1920, 1440, 1366, 1024, 768, 430, 390, 375 y 360 píxeles.
