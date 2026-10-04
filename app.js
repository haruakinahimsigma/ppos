/* =========================
   WINDOW SYSTEM
========================= */

function openWindow(id) {
  const win = document.getElementById(id);

  win.classList.remove("hidden");
  win.classList.remove("minimized");

  localStorage.setItem("window_" + id, "open");
}

function closeWindow(id) {
  document.getElementById(id).classList.add("hidden");

  localStorage.removeItem("window_" + id);
}

function minimizeWindow(id) {
  document.getElementById(id).classList.add("minimized");
}

function maximizeWindow(id) {
  document.getElementById(id).classList.toggle("maximized");
}

/* =========================
   CLOCK
========================= */

function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
}

setInterval(updateClock, 1000);

updateClock();

/* =========================
   MEMO APP
========================= */

const MEMO_STORAGE = "ppos_memos_v1";

let memos =
  JSON.parse(localStorage.getItem(MEMO_STORAGE)) ||
  [
    {
      id: crypto.randomUUID(),
      title: "Welcome 👋",
      body:
        "Welcome to PPOS!\n\n" +
        "This memo app automatically saves your notes.",
      updated: Date.now()
    }
  ];

let selectedMemoId = memos[0].id;

function saveMemos() {
  localStorage.setItem(
    MEMO_STORAGE,
    JSON.stringify(memos)
  );

  document.getElementById("memoStatus").textContent =
    "Saved locally • " +
    new Date().toLocaleTimeString();
}

function getSelectedMemo() {
  return memos.find(
    memo => memo.id === selectedMemoId
  );
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    char =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[char]
  );
}

function renderMemoList() {
  const list =
    document.getElementById("memoList");

  const query =
    document
      .getElementById("memoSearch")
      .value
      .toLowerCase();

  const filtered =
    memos.filter(memo =>
      `${memo.title} ${memo.body}`
        .toLowerCase()
        .includes(query)
    );

  list.innerHTML = "";

  filtered.forEach(memo => {
    const item =
      document.createElement("div");

    item.className =
      "memo-item" +
      (
        memo.id === selectedMemoId
          ? " active"
          : ""
      );

    item.innerHTML = `
      <div class="memo-item-title">
        ${escapeHTML(memo.title || "Untitled")}
      </div>

      <div class="memo-item-preview">
        ${escapeHTML(
          (memo.body || "Empty memo")
            .replace(/\n/g, " ")
        )}
      </div>
    `;

    item.onclick = () => {
      selectedMemoId = memo.id;

      loadSelectedMemo();
    };

    list.appendChild(item);
  });

  document.getElementById("memoCount").textContent =
    memos.length;
}

function loadSelectedMemo() {
  const memo = getSelectedMemo();

  if (!memo) return;

  document.getElementById("memoTitle").value =
    memo.title;

  document.getElementById("memoBody").value =
    memo.body;

  renderMemoList();
}

function updateMemo() {
  const memo = getSelectedMemo();

  if (!memo) return;

  memo.title =
    document.getElementById("memoTitle").value;

  memo.body =
    document.getElementById("memoBody").value;

  memo.updated = Date.now();

  saveMemos();

  renderMemoList();
}

function newMemo() {
  const memo = {
    id: crypto.randomUUID(),

    title: "New memo",

    body: "",

    updated: Date.now()
  };

  memos.unshift(memo);

  selectedMemoId = memo.id;

  saveMemos();

  loadSelectedMemo();

  document
    .getElementById("memoTitle")
    .focus();
}

function deleteMemo() {
  if (memos.length <= 1) {
    alert("You need to keep at least one memo.");

    return;
  }

  const shouldDelete =
    confirm("Delete this memo?");

  if (!shouldDelete) return;

  memos =
    memos.filter(
      memo => memo.id !== selectedMemoId
    );

  selectedMemoId =
    memos[0].id;

  saveMemos();

  loadSelectedMemo();
}

/* =========================
   BROWSER
========================= */

let browserHistory = [];

let browserHistoryIndex = -1;

function navigate() {
  let url =
    document.getElementById("addressBar").value.trim();

  if (!url) return;

  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {
    url = "https://" + url;
  }

  document.getElementById("addressBar").value =
    url;

  document.getElementById("browserFrame").src =
    url;

  browserHistory =
    browserHistory.slice(
      0,
      browserHistoryIndex + 1
    );

  browserHistory.push(url);

  browserHistoryIndex =
    browserHistory.length - 1;
}

function addressKey(event) {
  if (event.key === "Enter") {
    navigate();
  }
}

function reloadPage() {
  const frame =
    document.getElementById("browserFrame");

  frame.src = frame.src;
}

function goBack() {
  if (browserHistoryIndex <= 0) return;

  browserHistoryIndex--;

  const url =
    browserHistory[browserHistoryIndex];

  document.getElementById("addressBar").value =
    url;

  document.getElementById("browserFrame").src =
    url;
}

function goForward() {
  if (
    browserHistoryIndex >=
    browserHistory.length - 1
  ) {
    return;
  }

  browserHistoryIndex++;

  const url =
    browserHistory[browserHistoryIndex];

  document.getElementById("addressBar").value =
    url;

  document.getElementById("browserFrame").src =
    url;
}

function newTab() {
  alert(
    "Single-tab mode for now. Use the address bar to navigate."
  );
}

/* =========================
   RESTORE STATE
========================= */

if (
  localStorage.getItem(
    "window_memoWindow"
  ) === "open"
) {
  openWindow("memoWindow");
}

if (
  localStorage.getItem(
    "window_browserWindow"
  ) === "open"
) {
  openWindow("browserWindow");
}

renderMemoList();

loadSelectedMemo();

/* =========================
   KEYBOARD SHORTCUTS
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "n"
    ) {
      event.preventDefault();

      openWindow("memoWindow");

      newMemo();
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "s"
    ) {
      event.preventDefault();

      saveMemos();
    }

  }
);
