
# 🧹 Quidditch Rol

Una pequeña web para acompañar partidas de rol de Quidditch. Permite registrar equipos y jugadores, realizar tiradas de dados D20 y consultar el historial de tiradas.

Está diseñada para funcionar gratuitamente con **GitHub Pages**, sin servidor, base de datos externa ni dependencias de terceros.

## ✨ Funcionalidades

- 🎲 Tiradas de D20 con resultados del 1 al 20.
- 🏆 Registro y gestión de equipos.
- 🧙 Registro de jugadores y sus posiciones.
- 📜 Historial de tiradas con información de cada acción.
- 📥 Exportación del historial de tiradas en formato CSV.
- 💾 Guardado de datos en el navegador mediante `localStorage`.
- 📱 Diseño adaptable a ordenadores, tabletas y móviles.

## 📁 Archivos del proyecto

Todos los archivos deben estar en la raíz del repositorio:

- `index.html`: estructura de la página.
- `style.css`: diseño y estilos.
- `script.js`: tiradas, equipos, jugadores e historial.
- `README.md`: documentación del proyecto.

## 🚀 Cómo publicar la web con GitHub Pages

### 1. Crear el repositorio

1. Entra en [GitHub](https://github.com/).
2. Crea un repositorio nuevo llamado `quidditch-rol`.
3. Puedes marcarlo como público para facilitar su publicación.
4. Crea el repositorio.

### 2. Subir los archivos

Dentro del repositorio:

1. Pulsa **Add file**.
2. Selecciona **Upload files** o **Create new file**.
3. Sube o crea `index.html`, `style.css`, `script.js` y `README.md`.
4. Asegúrate de que los cuatro archivos estén en la raíz del repositorio, no dentro de otra carpeta.
5. Pulsa **Commit changes** para guardar los cambios.

### 3. Activar GitHub Pages

1. Abre la pestaña **Settings** del repositorio.
2. En el menú lateral, entra en **Pages**.
3. En la sección **Build and deployment**, selecciona **Deploy from a branch**.
4. Elige la rama `main`.
5. Selecciona la carpeta `/(root)`.
6. Pulsa **Save**.

### 4. Abrir la web

Espera unos minutos a que GitHub publique el sitio.

Si tu usuario de GitHub es `TU-USUARIO` y el repositorio se llama `quidditch-rol`, la dirección será:

`https://TU-USUARIO.github.io/quidditch-rol/`

Sustituye `TU-USUARIO` por tu nombre de usuario real de GitHub.

## 🎮 Cómo utilizarla

1. Abre la página publicada.
2. Registra los equipos y sus jugadores.
3. Introduce los datos de una tirada D20 y realiza la tirada.
4. Consulta el historial para revisar los resultados.
5. Exporta el historial a CSV si quieres conservarlo en un archivo.

El resto de la partida —narración, escenas, decisiones y roleo— puede desarrollarse como prefiera el grupo.

## 💾 Cómo se guardan los datos

La aplicación utiliza `localStorage` del navegador.

**Importante:** los datos se guardan en el navegador y dispositivo donde se utiliza la web. No se sincronizan automáticamente entre jugadores ni entre distintos dispositivos.

- Si abres la web desde otro navegador, no verás automáticamente los datos guardados en el primero.
- Si borras los datos del sitio o el almacenamiento del navegador, puedes perder la información guardada.
- Puedes exportar el historial de tiradas en CSV como copia de los resultados.

GitHub Pages publica los archivos de la web, pero no proporciona una base de datos compartida para esta aplicación.

## 🔧 Solución de problemas

- **La página no carga:** comprueba que `index.html` esté en la raíz del repositorio.
- **La página aparece sin estilos:** verifica que el archivo se llame exactamente `style.css`.
- **Los botones no funcionan:** verifica que `script.js` esté en la raíz y que su nombre coincida con el de la referencia en `index.html`.
- **GitHub Pages todavía no muestra los cambios:** espera unos minutos y vuelve a cargar la página.
- **No aparecen los datos de otro jugador:** es normal; cada navegador mantiene su propio almacenamiento local.

## 📜 Licencia

Proyecto personal para partidas de rol. Puedes adaptar los archivos a las necesidades de tu grupo.
