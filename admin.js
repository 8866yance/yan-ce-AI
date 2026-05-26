const API_BASE = "";
const state = {
  token: localStorage.getItem("yanCeAdminToken") || "",
  currentView: "dashboard"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function fmtMoney(value) {
  return `¥${Number(value || 0).toFixed(2)}`;
}

function fmtDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}

function tag(value, type = "") {
  return `<span class="tag ${type}">${value || "-"}</span>`;
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || data.code || `接口请求失败：${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function setStatus(text, ok = true) {
  $("#api-status").textContent = text;
  $("#api-status").style.color = ok ? "var(--ok)" : "var(--danger)";
}

function showApp(loggedIn) {
  $("#login-panel").hidden = loggedIn;
  $("#content").hidden = !loggedIn;
  $("#logout-button").hidden = !loggedIn;
  document.body.classList.toggle("is-logged-in", loggedIn);
  document.body.classList.toggle("is-logged-out", !loggedIn);
  $$(".nav__item").forEach((item) => {
    item.disabled = !loggedIn;
    item.title = loggedIn ? "" : "请先登录后台";
  });
}

async function checkApi() {
  try {
    const response = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    const health = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`健康检查失败：${response.status}`);
    setStatus(`API: ${health.ok ? "正常" : "异常"}`, Boolean(health.ok));
  } catch (error) {
    setStatus("API: 异常", false);
  }
}

async function login(event) {
  event.preventDefault();
  $("#login-message").textContent = "";
  try {
    const data = await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({
        email: $("#admin-email").value.trim(),
        password: $("#admin-password").value
      })
    });
    state.token = data.token;
    localStorage.setItem("yanCeAdminToken", state.token);
    showApp(true);
    await loadCurrentView();
  } catch (error) {
    $("#login-message").textContent = error.message;
  }
}

function logout() {
  state.token = "";
  localStorage.removeItem("yanCeAdminToken");
  showApp(false);
  $("#view-title").textContent = "管理员登录";
  $("#login-message").textContent = "";
}

function switchView(view) {
  if (!state.token) {
    $("#login-message").textContent = "请先点击“登录后台”，登录成功后再进入各管理模块。";
    return;
  }
  state.currentView = view;
  $$(".nav__item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === view));
  $$(".view").forEach((item) => item.classList.toggle("is-active", item.dataset.viewPanel === view));
  $("#view-title").textContent = $(`.nav__item[data-view="${view}"]`)?.textContent || "后台";
  loadCurrentView();
}

async function loadCurrentView() {
  if (!state.token) return;
  const loaders = {
    dashboard: loadDashboard,
    users: loadUsers,
    orders: loadOrders,
    plans: loadPlans,
    points: loadPackages,
    analysis: loadAnalysis,
    prompts: loadPrompts,
    security: loadSecurity
  };
  try {
    await loaders[state.currentView]?.();
    await checkApi();
  } catch (error) {
    setStatus(`接口错误：${error.message}`, false);
    if (error.status === 401 || /管理员未登录|未登录|UNAUTHORIZED|ADMIN_UNAUTHORIZED/.test(error.message)) logout();
  }
}

function renderTable(table, columns, rows, emptyText = "暂无数据") {
  table.innerHTML = `
    <thead><tr>${columns.map((col) => `<th>${col.label}</th>`).join("")}</tr></thead>
    <tbody>
      ${rows.length ? rows.map((row) => `<tr>${columns.map((col) => `<td>${col.render ? col.render(row) : row[col.key] ?? "-"}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${columns.length}" class="muted">${emptyText}</td></tr>`}
    </tbody>
  `;
}

async function loadDashboard() {
  const data = await api("/api/admin/dashboard");
  const s = data.summary;
  const metrics = [
    ["注册总人数", s.totalUsers],
    ["今日新增用户", s.todayUsers],
    ["当前在线人数", s.onlineUsers],
    ["今日分析次数", s.todayAnalysis],
    ["今日充值金额", fmtMoney(s.todayRechargeAmount)],
    ["累计充值金额", fmtMoney(s.totalRechargeAmount)],
    ["会员用户数量", s.memberUsers],
    ["疑似攻击次数", s.suspectedAttacks]
  ];
  $("#metrics-grid").innerHTML = metrics.map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`).join("");

  const hourly = data.charts.hourly || [];
  const max = Math.max(...hourly.map((item) => item.analysisCount), 1);
  $("#hourly-bars").innerHTML = hourly.map((item) => {
    const height = Math.max(3, Math.round((item.analysisCount / max) * 100));
    return `<div class="bar" title="${item.hour}:00 ${item.analysisCount}次" style="height:${height}%"><span>${item.hour}</span></div>`;
  }).join("");

  $("#hot-types").innerHTML = (data.hotTypes || []).length
    ? data.hotTypes.map((item) => `<div class="list-item"><strong>${item.analysisType}</strong><p>${item._count.analysisType} 次</p></div>`).join("")
    : `<div class="list-item"><strong>暂无提问类型</strong><p>有分析记录后这里会显示排行。</p></div>`;
}

async function loadUsers() {
  const keyword = $("#user-keyword").value.trim();
  const data = await api(`/api/admin/users?pageSize=50${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""}`);
  renderTable($("#users-table"), [
    { label: "昵称", render: (row) => row.nickname || "-" },
    { label: "OpenID", render: (row) => `<span class="muted">${row.openid || "-"}</span>` },
    { label: "状态", render: (row) => tag(row.status, row.status === "active" ? "is-ok" : "is-danger") },
    { label: "会员", render: (row) => row.currentMembershipStatus },
    { label: "积分", render: (row) => row.currentPoints },
    { label: "累计分析", render: (row) => row.totalAnalysisCount },
    { label: "累计充值", render: (row) => fmtMoney(row.totalRechargeAmount) },
    { label: "注册时间", render: (row) => fmtDate(row.registeredAt) }
  ], data.items || []);
}

async function loadOrders() {
  const status = $("#order-status").value;
  const orderType = $("#order-type").value;
  const query = new URLSearchParams();
  if (status) query.set("status", status);
  if (orderType) query.set("orderType", orderType);
  const data = await api(`/api/admin/orders?pageSize=50&${query.toString()}`);
  renderTable($("#orders-table"), [
    { label: "订单号", render: (row) => `<span class="muted">${row.orderNo}</span>` },
    { label: "类型", render: (row) => row.orderType === "membership" ? "会员" : "积分" },
    { label: "商品", render: (row) => row.productName || row.productId },
    { label: "金额", render: (row) => fmtMoney(row.amount) },
    { label: "状态", render: (row) => tag(row.status, row.status === "paid" ? "is-ok" : row.status === "failed" ? "is-danger" : "") },
    { label: "支付时间", render: (row) => fmtDate(row.paidAt) },
    { label: "创建时间", render: (row) => fmtDate(row.createdAt) }
  ], data.items || []);
}

function formToObject(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  form.querySelectorAll("input[type='checkbox']").forEach((input) => {
    data[input.name] = input.checked;
  });
  ["durationDays", "analysisLimit", "sortOrder", "points", "bonusPoints"].forEach((key) => {
    if (key in data) data[key] = Number(data[key] || 0);
  });
  return data;
}

function fillForm(form, item) {
  Object.entries(item).forEach(([key, value]) => {
    const input = form.elements[key];
    if (!input) return;
    if (input.type === "checkbox") input.checked = Boolean(value);
    else input.value = value ?? "";
  });
}

function resetForm(form) {
  form.reset();
  form.elements.id.value = "";
  form.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.checked = input.name === "enabled";
  });
}

async function loadPlans() {
  const data = await api("/api/admin/membership-plans");
  renderTable($("#plans-table"), [
    { label: "名称", render: (row) => row.name },
    { label: "价格", render: (row) => fmtMoney(row.price) },
    { label: "有效期", render: (row) => `${row.durationDays} 天` },
    { label: "次数", render: (row) => row.unlimited ? "不限" : `${row.analysisLimit} 次` },
    { label: "状态", render: (row) => tag(row.enabled ? "启用" : "禁用", row.enabled ? "is-ok" : "is-danger") },
    { label: "操作", render: (row) => `<div class="row-actions"><button data-edit-plan="${row.id}">编辑</button></div>` }
  ], data.items || []);
  $("#plans-table").querySelectorAll("[data-edit-plan]").forEach((button) => {
    button.addEventListener("click", () => fillForm($("#plan-form"), data.items.find((item) => item.id === button.dataset.editPlan)));
  });
}

async function savePlan(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = formToObject(form);
  const id = data.id;
  delete data.id;
  if (id) {
    await api(`/api/admin/membership-plans/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  } else {
    await api("/api/admin/membership-plans", { method: "POST", body: JSON.stringify(data) });
  }
  resetForm(form);
  await loadPlans();
}

async function loadPackages() {
  const data = await api("/api/admin/point-packages");
  renderTable($("#packages-table"), [
    { label: "名称", render: (row) => row.name },
    { label: "价格", render: (row) => fmtMoney(row.price) },
    { label: "积分", render: (row) => `${row.points} + ${row.bonusPoints}` },
    { label: "状态", render: (row) => tag(row.enabled ? "启用" : "禁用", row.enabled ? "is-ok" : "is-danger") },
    { label: "描述", render: (row) => row.description || "-" },
    { label: "操作", render: (row) => `<div class="row-actions"><button data-edit-package="${row.id}">编辑</button></div>` }
  ], data.items || []);
  $("#packages-table").querySelectorAll("[data-edit-package]").forEach((button) => {
    button.addEventListener("click", () => fillForm($("#package-form"), data.items.find((item) => item.id === button.dataset.editPackage)));
  });
}

async function savePackage(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = formToObject(form);
  const id = data.id;
  delete data.id;
  if (id) {
    await api(`/api/admin/point-packages/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  } else {
    await api("/api/admin/point-packages", { method: "POST", body: JSON.stringify(data) });
  }
  resetForm(form);
  await loadPackages();
}

async function loadAnalysis() {
  const data = await api("/api/admin/analysis-records?pageSize=50");
  renderTable($("#analysis-table"), [
    { label: "用户", render: (row) => `<span class="muted">${row.userId}</span>` },
    { label: "类型", render: (row) => row.analysisType },
    { label: "提问内容", render: (row) => row.submitContent },
    { label: "消耗积分", render: (row) => row.pointsCost },
    { label: "会员免费", render: (row) => row.memberFree ? "是" : "否" },
    { label: "状态", render: (row) => tag(row.success ? "成功" : "失败", row.success ? "is-ok" : "is-danger") },
    { label: "耗时", render: (row) => row.durationMs ? `${row.durationMs}ms` : "-" },
    { label: "时间", render: (row) => fmtDate(row.createdAt) }
  ], data.items || []);
}

async function loadPrompts() {
  const [versions, suggestions] = await Promise.all([
    api("/api/admin/prompt-versions"),
    api("/api/admin/prompt-suggestions")
  ]);
  renderTable($("#prompts-table"), [
    { label: "版本", render: (row) => `v${row.versionNo}` },
    { label: "标题", render: (row) => row.title },
    { label: "状态", render: (row) => tag(row.status, row.status === "active" ? "is-ok" : "") },
    { label: "来源", render: (row) => row.baseVersionNo ? `基于 v${row.baseVersionNo}` : "原始版本" },
    { label: "修改原因", render: (row) => row.changeReason || "-" },
    { label: "创建时间", render: (row) => fmtDate(row.createdAt) },
    {
      label: "操作",
      render: (row) => `
        <div class="row-actions">
          <button data-edit-from-prompt="${row.id}">基于此版本修改</button>
          ${row.status === "active" ? "" : `<button data-activate-prompt="${row.id}">设为生效</button>`}
        </div>
      `
    }
  ], versions.items || []);
  $("#prompts-table").querySelectorAll("[data-edit-from-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = versions.items.find((version) => version.id === button.dataset.editFromPrompt);
      const form = $("#prompt-form");
      form.elements.baseVersionId.value = item.id;
      form.elements.title.value = `${item.title} - 修改版`;
      form.elements.content.value = item.content;
      form.elements.changeReason.value = `基于 v${item.versionNo} 修改：`;
      form.elements.activate.checked = true;
      $("#prompt-base-note").textContent = `正在基于 v${item.versionNo} 修改，保存后会生成新版本，原 v${item.versionNo} 不会删除。`;
      $("#prompt-message").textContent = "";
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  $("#prompts-table").querySelectorAll("[data-activate-prompt]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/admin/prompt-versions/${button.dataset.activatePrompt}/activate`, { method: "POST", body: "{}" });
      await loadPrompts();
    });
  });
  $("#suggestions-list").innerHTML = (suggestions.items || []).length
    ? suggestions.items.map((item) => `<div class="list-item"><strong>${item.questionType} · ${item.status}</strong><p>${item.recommendedSnippet}</p></div>`).join("")
    : `<div class="list-item"><strong>暂无优化建议</strong><p>点击“生成建议”后，会基于真实分析记录生成。</p></div>`;
}

async function savePrompt(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const body = formToObject(form);
  $("#prompt-message").textContent = "";
  await api("/api/admin/prompt-versions", {
    method: "POST",
    body: JSON.stringify(body)
  });
  $("#prompt-message").textContent = body.activate ? "已保存，并设为当前生效提示词。" : "已保存为草稿版本。";
  form.reset();
  form.elements.title.value = "八字分析系统提示词";
  form.elements.activate.checked = true;
  form.elements.baseVersionId.value = "";
  $("#prompt-base-note").textContent = "";
  await loadPrompts();
}

async function generateSuggestions() {
  await api("/api/admin/prompt-suggestions/generate", { method: "POST", body: "{}" });
  await loadPrompts();
}

async function loadSecurity() {
  const [security, logs] = await Promise.all([
    api("/api/admin/security-events"),
    api("/api/admin/request-logs?pageSize=50")
  ]);
  renderTable($("#security-table"), [
    { label: "类型", render: (row) => row.eventType },
    { label: "IP", render: (row) => row.attackIp },
    { label: "次数", render: (row) => row.requestCount },
    { label: "路径", render: (row) => row.attackPath || "-" },
    { label: "状态", render: (row) => tag(row.status, row.status === "open" ? "is-danger" : "is-ok") },
    { label: "最近出现", render: (row) => fmtDate(row.lastSeenAt) }
  ], security.events || []);
  renderTable($("#logs-table"), [
    { label: "IP", render: (row) => row.ip },
    { label: "方法", render: (row) => row.method },
    { label: "路径", render: (row) => row.path },
    { label: "状态", render: (row) => row.statusCode },
    { label: "耗时", render: (row) => `${row.durationMs}ms` },
    { label: "时间", render: (row) => fmtDate(row.requestTime) }
  ], logs.items || []);
}

function bindEvents() {
  $("#login-form").addEventListener("submit", login);
  $("#logout-button").addEventListener("click", logout);
  $("#refresh-button").addEventListener("click", loadCurrentView);
  $$(".nav__item").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
  document.body.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    if (action === "load-users") loadUsers();
    if (action === "load-orders") loadOrders();
    if (action === "reset-plan") resetForm($("#plan-form"));
    if (action === "reset-package") resetForm($("#package-form"));
    if (action === "load-prompts") loadPrompts();
    if (action === "generate-suggestions") generateSuggestions();
    if (action === "reset-prompt") {
      $("#prompt-form").reset();
      $("#prompt-form").elements.title.value = "八字分析系统提示词";
      $("#prompt-form").elements.activate.checked = true;
      $("#prompt-form").elements.baseVersionId.value = "";
      $("#prompt-base-note").textContent = "";
      $("#prompt-message").textContent = "";
    }
  });
  $("#plan-form").addEventListener("submit", savePlan);
  $("#package-form").addEventListener("submit", savePackage);
  $("#prompt-form").addEventListener("submit", savePrompt);
}

async function boot() {
  bindEvents();
  await checkApi();
  showApp(Boolean(state.token));
  if (state.token) await loadCurrentView();
}

boot();
