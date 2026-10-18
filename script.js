
(() => {
  "use strict";

  const STORAGE_KEY = "quidditch-role-d20-v1";

  const $ = (id) => document.getElementById(id);

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

      if (
        saved &&
        Array.isArray(saved.teams) &&
        Array.isArray(saved.rolls)
      ) {
        return saved;
      }
    } catch (error) {
      console.warn("No se pudieron recuperar los datos guardados.", error);
    }

    return { teams: [], rolls: [] };
  }

  let state = loadState();
  let toastTimer;

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error("No se pudieron guardar los datos.", error);
      showToast("No se pudieron guardar los datos en este navegador.");
      return false;
    }
  }

  function showToast(message) {
    const toast = $("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  function makeId() {
    if (
      globalThis.crypto &&
      typeof globalThis.crypto.randomUUID === "function"
    ) {
      return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function teamName(teamId) {
    const team = state.teams.find((item) => item.id === teamId);
    return team ? team.name : "Sin equipo";
  }

  // Actualizar los selectores de equipos.

  function renderTeamOptions() {
    const rollSelect = $("roll-team");
    const playerSelect = $("player-team");

    const currentRoll = rollSelect.value;
    const currentPlayer = playerSelect.value;

    rollSelect.innerHTML =
      '<option value="">Sin equipo / partida libre</option>' +
      state.teams.map((team) => `
        <option value="${escapeHTML(team.id)}">
          ${escapeHTML(team.name)}
        </option>
      `).join("");

    playerSelect.innerHTML = state.teams.length
      ? '<option value="">Selecciona equipo</option>' +
        state.teams.map((team) => `
          <option value="${escapeHTML(team.id)}">
            ${escapeHTML(team.name)}
          </option>
        `).join("")
      : '<option value="">Primero crea un equipo</option>';

    if (state.teams.some((team) => team.id === currentRoll)) {
      rollSelect.value = currentRoll;
    }

    if (state.teams.some((team) => team.id === currentPlayer)) {
      playerSelect.value = currentPlayer;
    }
  }

  // Mostrar equipos y sus jugadores.

  function renderTeams() {
    const root = $("team-list");

    if (state.teams.length === 0) {
      root.innerHTML = `
        <div class="empty-card">
          ✧<br><br>
          Aún no hay equipos.<br>
          Crea el primero desde el formulario.
        </div>
      `;
      return;
    }

    root.innerHTML = state.teams.map((team) => `
      <article class="team-card">
        <div class="team-card-head">
          <div>
            <h3>${escapeHTML(team.name)}</h3>
            <div class="team-subtitle">
              ${escapeHTML(team.house || "EQUIPO DE QUIDDITCH")}
              · ${team.players.length} jugador(es)
            </div>
          </div>

          <button
            class="icon-button"
            type="button"
            data-delete-team="${escapeHTML(team.id)}"
            aria-label="Eliminar equipo"
            title="Eliminar equipo"
          >✕</button>
        </div>

        ${
          team.players.length
            ? `<ul class="roster">
                ${team.players.map((player) => `
                  <li>
                    <span class="player-info">
                      ${escapeHTML(player.name)}
                      <span class="position">
                        ${escapeHTML(player.position)}
                      </span>
                    </span>

                    <button
                      class="icon-button"
                      type="button"
                      data-delete-player="${escapeHTML(team.id)}"
                      data-player-id="${escapeHTML(player.id)}"
                      aria-label="Eliminar jugador"
                      title="Eliminar jugador"
                    >−</button>
                  </li>
                `).join("")}
              </ul>`
            : `<p class="form-help">
                Todavía no hay jugadores en este equipo.
              </p>`
        }
      </article>
    `).join("");
  }

  // Mostrar el historial de las tiradas.

  function renderHistory() {
    const body = $("history-body");

    $("history-count").textContent =
      `${state.rolls.length} ${
        state.rolls.length === 1
          ? "tirada registrada"
          : "tiradas registradas"
      }`;

    if (state.rolls.length === 0) {
      body.innerHTML = `
        <tr>
          <td colspan="6" class="empty">
            Aún no hay tiradas. ¡Lanza el D20 para empezar!
          </td>
        </tr>
      `;
      return;
    }

    body.innerHTML = [...state.rolls].reverse().map((roll) => {
      const date = new Date(roll.timestamp);

      const dateText = Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleString("es-ES", {
            dateStyle: "short",
            timeStyle: "short"
          });

      return `
        <tr>
          <td>
            <span class="result-pill ${
              roll.result === 20 ? "critical" : ""
            }">${roll.result}</span>
          </td>

          <td>${escapeHTML(roll.player || "Anónimo")}</td>

          <td>${escapeHTML(teamName(roll.teamId))}</td>

          <td class="action-cell">
            ${escapeHTML(roll.action || "—")}
            ${
              roll.notes
                ? `<div class="form-help">
                    ${escapeHTML(roll.notes)}
                  </div>`
                : ""
            }
          </td>

          <td>${escapeHTML(dateText)}</td>

          <td>
            <button
              class="icon-button"
              type="button"
              data-delete-roll="${escapeHTML(roll.id)}"
              aria-label="Eliminar tirada"
              title="Eliminar tirada"
            >✕</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderAll() {
    renderTeamOptions();
    renderTeams();
    renderHistory();
  }

  // Crear equipos.

  $("team-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("team-name").value.trim();
    const house = $("team-house").value.trim();

    if (!name) {
      showToast("Escribe un nombre para el equipo.");
      return;
    }

    const team = {
      id: makeId(),
      name,
      house,
      players: []
    };

    state.teams.push(team);

    if (!persist()) {
      state.teams.pop();
      return;
    }

    $("team-name").value = "";
    $("team-house").value = "";

    renderAll();

    $("player-team").value = team.id;

    showToast(`Equipo «${name}» creado.`);
  });

  // Añadir jugadores.

  $("add-player").addEventListener("click", () => {
    const teamId = $("player-team").value;
    const name = $("player-name").value.trim();
    const position = $("player-position").value;

    const team = state.teams.find((item) => item.id === teamId);

    if (!team) {
      showToast("Selecciona un equipo válido.");
      return;
    }

    if (!name) {
      showToast("Escribe el nombre del jugador.");
      return;
    }

    const player = {
      id: makeId(),
      name,
      position
    };

    team.players.push(player);

    if (!persist()) {
      team.players.pop();
      return;
    }

    $("player-name").value = "";

    renderAll();

    $("player-team").value = teamId;

    showToast(`${name} añadido a ${team.name}.`);
  });

  // Eliminar equipos o jugadores.

  $("team-list").addEventListener("click", (event) => {
    const teamButton = event.target.closest("[data-delete-team]");
    const playerButton = event.target.closest("[data-delete-player]");

    if (teamButton) {
      const team = state.teams.find(
        (item) => item.id === teamButton.dataset.deleteTeam
      );

      if (!team) return;

      if (!confirm(
        `¿Eliminar el equipo «${team.name}» y sus jugadores? ` +
        "Las tiradas anteriores se conservarán."
      )) {
        return;
      }

      const previousTeams = state.teams;
      state.teams = state.teams.filter((item) => item.id !== team.id);

      if (!persist()) {
        state.teams = previousTeams;
        return;
      }

      renderAll();
      showToast("Equipo eliminado.");
      return;
    }

    if (playerButton) {
      const team = state.teams.find(
        (item) => item.id === playerButton.dataset.deletePlayer
      );

      if (!team) return;

      const previousPlayers = [...team.players];

      team.players = team.players.filter(
        (player) => player.id !== playerButton.dataset.playerId
      );

      if (!persist()) {
        team.players = previousPlayers;
        return;
      }

      renderAll();
      showToast("Jugador eliminado.");
    }
  });

  // Lanzar el D20.

  $("roll-button").addEventListener("click", () => {
    const die = $("die");
    const button = $("roll-button");

    button.disabled = true;

    die.classList.remove("rolling");

    // Reiniciar la animación para que funcione en cada tirada.
    void die.offsetWidth;

    die.classList.add("rolling");

    // Entero aleatorio entre 1 y 20, ambos incluidos.
    const result = Math.floor(Math.random() * 20) + 1;

    const roll = {
      id: makeId(),
      result,
      player: $("roll-player").value.trim(),
      teamId: $("roll-team").value,
      action: $("roll-action").value.trim(),
      notes: $("roll-notes").value.trim(),
      timestamp: new Date().toISOString()
    };

    state.rolls.push(roll);

    if (!persist()) {
      state.rolls.pop();
      button.disabled = false;
      die.classList.remove("rolling");
      showToast("La tirada no se ha podido guardar.");
      return;
    }

    $("die-number").textContent = result;

    if (result === 20) {
      $("roll-hint").textContent =
        "¡20 natural! Un resultado extraordinario…";
    } else if (result === 1) {
      $("roll-hint").textContent =
        "¡1 natural! La suerte te pone a prueba…";
    } else {
      $("roll-hint").textContent =
        `Ha salido un ${result}. Que el rol decida qué ocurre.`;
    }

    renderHistory();

    setTimeout(() => {
      die.classList.remove("rolling");
      button.disabled = false;
    }, 560);
  });

  // Eliminar una tirada concreta.

  $("history-body").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-roll]");

    if (!button) return;

    const previousRolls = state.rolls;

    state.rolls = state.rolls.filter(
      (roll) => roll.id !== button.dataset.deleteRoll
    );

    if (!persist()) {
      state.rolls = previousRolls;
      return;
    }

    renderHistory();
    showToast("Tirada eliminada.");
  });

  // Borrar todo el historial.

  $("clear-history").addEventListener("click", () => {
    if (state.rolls.length === 0) {
      showToast("El historial ya está vacío.");
      return;
    }

    if (!confirm(
      "¿Seguro que quieres borrar todas las tiradas? " +
      "Esta acción no se puede deshacer."
    )) {
      return;
    }

    const previousRolls = state.rolls;
    state.rolls = [];

    if (!persist()) {
      state.rolls = previousRolls;
      return;
    }

    renderHistory();
    showToast("Historial borrado.");
  });

  // Exportar las tiradas como CSV para Excel o Google Sheets.

  $("export-button").addEventListener("click", () => {
    if (state.rolls.length === 0) {
      showToast("No hay tiradas para exportar.");
      return;
    }

    const headers = [
      "resultado",
      "jugador",
      "equipo",
      "accion",
      "notas",
      "fecha"
    ];

    const rows = state.rolls.map((roll) => [
      roll.result,
      roll.player || "",
      teamName(roll.teamId),
      roll.action || "",
      roll.notes || "",
      roll.timestamp
    ]);

    const csvCell = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = "\uFEFF" + [
      headers,
      ...rows
    ].map((row) => row.map(csvCell).join(";")).join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quidditch-historial.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showToast("Historial exportado como CSV.");
  });

  // Inicializar la web con los datos guardados.

  renderAll();
})();
