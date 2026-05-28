const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const stemElement = { 甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土", 己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水" };
const branchElement = { 子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火", 午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水" };
const elementClass = { 木: "wood", 火: "fire", 土: "earth", 金: "metal", 水: "water" };
const hiddenStems = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "庚", "戊"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"]
};
const stages = ["长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养"];
const voids = ["戌亥", "申酉", "午未", "辰巳", "寅卯", "子丑"];
const nayins = ["海中金", "炉中火", "大林木", "路旁土", "剑锋金", "山头火", "涧下水", "城头土", "白蜡金", "杨柳木", "泉中水", "屋上土", "霹雳火", "松柏木", "长流水", "沙中金", "山下火", "平地木"];
const shaList = ["天乙贵人", "文昌贵人", "国印贵人", "太极贵人", "德秀贵人", "驿马", "华盖", "桃花", "将星", "禄神", "红鸾", "天厨贵人"];
const producingElement = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const controllingElement = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };
const stemCombinations = {
  甲己: "甲己合土",
  乙庚: "乙庚合金",
  丙辛: "丙辛合水",
  丁壬: "丁壬合木",
  戊癸: "戊癸合火"
};
const branchRelations = {
  六合: ["子丑", "寅亥", "卯戌", "辰酉", "巳申", "午未"],
  六冲: ["子午", "丑未", "寅申", "卯酉", "辰戌", "巳亥"],
  六害: ["子未", "丑午", "寅巳", "卯辰", "申亥", "酉戌"],
  相破: ["子酉", "丑辰", "寅亥", "卯午", "巳申", "未戌"],
  相刑: ["子卯", "寅巳", "巳申", "丑戌", "戌未", "辰辰", "午午", "酉酉", "亥亥"],
  三合: ["申子辰", "寅午戌", "亥卯未", "巳酉丑"],
  三会: ["寅卯辰", "巳午未", "申酉戌", "亥子丑"]
};
const shenShaRules = {
  桃花: { 申子辰: "酉", 寅午戌: "卯", 巳酉丑: "午", 亥卯未: "子" },
  驿马: { 申子辰: "寅", 寅午戌: "申", 巳酉丑: "亥", 亥卯未: "巳" },
  华盖: { 申子辰: "辰", 寅午戌: "戌", 巳酉丑: "丑", 亥卯未: "未" },
  将星: { 申子辰: "子", 寅午戌: "午", 巳酉丑: "酉", 亥卯未: "卯" },
  灾煞: { 申子辰: "午", 寅午戌: "子", 巳酉丑: "卯", 亥卯未: "酉" },
  劫煞: { 申子辰: "巳", 寅午戌: "亥", 巳酉丑: "寅", 亥卯未: "申" }
};
const tianYi = { 甲: ["丑", "未"], 戊: ["丑", "未"], 庚: ["丑", "未"], 乙: ["子", "申"], 己: ["子", "申"], 丙: ["亥", "酉"], 丁: ["亥", "酉"], 壬: ["巳", "卯"], 癸: ["巳", "卯"], 辛: ["午", "寅"] };
const wenChang = { 甲: "巳", 乙: "午", 丙: "申", 丁: "酉", 戊: "申", 己: "酉", 庚: "亥", 辛: "子", 壬: "寅", 癸: "卯" };
const yangRen = { 甲: "卯", 乙: "寅", 丙: "午", 丁: "巳", 戊: "午", 己: "巳", 庚: "酉", 辛: "申", 壬: "子", 癸: "亥" };
const luShen = { 甲: "寅", 乙: "卯", 丙: "巳", 丁: "午", 戊: "巳", 己: "午", 庚: "申", 辛: "酉", 壬: "亥", 癸: "子" };
const monthLabels = ["立春 2月", "惊蛰 3月", "清明 4月", "立夏 5月", "芒种 6月", "小暑 7月", "立秋 8月", "白露 9月", "寒露 10月", "立冬 11月", "大雪 12月", "小寒 次年1月"];
const termDescriptions = {
  桃花: "人缘与吸引力较强。",
  驿马: "变动与外出机会多。",
  华盖: "独立感强，思考较深。",
  天乙贵人: "遇事较易得助力。",
  文昌贵人: "学习表达能力较佳。",
  文昌: "学习表达能力较佳。",
  将星: "执行力和掌控感强。",
  羊刃: "个性较强，行动果断。",
  禄神: "资源和稳定感较好。",
  空亡: "对应领域易有落空感。",
  灾煞: "变化阻力需留意。",
  劫煞: "竞争损耗需谨慎。",
  太岁: "当年外部主题较明显。",
  岁破: "容易引动变化调整。",
  正印: "学习、贵人、保护感。",
  偏印: "灵感、专业、独立思考。",
  比肩: "自我、同伴、竞争意识。",
  劫财: "行动、人际、资源分流。",
  食神: "表达、作品、舒展感。",
  伤官: "表达、突破、规则摩擦。",
  正财: "稳定收入和现实事务。",
  偏财: "机会资源和流动财务。",
  正官: "规则、责任、职业秩序。",
  七杀: "压力、挑战、执行强度。",
  星运: "十二长生的气势阶段。",
  纳音: "干支组合的辅助五行象。",
  藏干: "地支内部隐藏的天干。",
  神煞: "辅助参考，不单独定吉凶。"
};
let chinaPlaces = [];
let currentSelection = { luck: null, year: null, month: null };
let baziState = null;
let pendingSinglePayAction = null;
let currentSingleReading = null;
let paidOrderNo = null;
let singleReadingText = "";
let singleReadingQuestion = "";

const fallbackPlaces = [
  {
    code: "11",
    name: "北京市",
    children: [
      {
        code: "1101",
        name: "市辖区",
        children: [
          {
            code: "110101",
            name: "东城区",
            children: [{ code: "110101001", name: "东华门街道" }]
          }
        ]
      }
    ]
  }
];

function mod(value, length) {
  return ((value % length) + length) % length;
}

function splitPillar(value) {
  return { stem: value.slice(0, 1), branch: value.slice(1, 2) };
}

function elementOfChar(char) {
  return stemElement[char] || branchElement[char] || "";
}

function renderGanZhiPart(char, part = "") {
  const element = elementOfChar(char);
  const className = element ? ` element-${elementClass[element]}` : "";
  return `<span class="gz-char${className}" data-part="${part}" data-element="${element}" title="${char} · ${element || ""}"><b>${char}</b></span>`;
}

function renderGanZhi(pillar) {
  if (!pillar) return "";
  const { stem, branch } = splitPillar(pillar);
  return `<span class="gz-pair">${renderGanZhiPart(stem, "stem")}${renderGanZhiPart(branch, "branch")}</span>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function explainTerm(term) {
  const key = Object.keys(termDescriptions).find((name) => term.includes(name) || name.includes(term));
  return key ? termDescriptions[key] : "暂无详细说明。";
}

function renderShaChips(value) {
  const items = String(value || "参考")
    .split(/[、·\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(items)].map((item) => {
    const tip = explainTerm(item);
    return `<span class="sha-chip" tabindex="0" data-tip="${escapeHtml(tip)}" title="${escapeHtml(tip)}">${escapeHtml(item)}</span>`;
  }).join("");
}

function parseDateParts(dateValue) {
  const [year = "1996", month = "08", day = "18"] = (dateValue || "1996-08-18").split("-");
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day)
  };
}

function getBirthDate(dateValue, timeValue, calendarType = "公历", lunarLeapMode = "normal") {
  const [hour = "0", minute = "0"] = (timeValue || "00:00").split(":");
  const { year, month, day } = parseDateParts(dateValue);
  const h = Number(hour);
  const m = Number(minute);

  if (calendarType === "农历") {
    const lunarMonth = lunarLeapMode === "leap" ? -month : month;
    const solar = Lunar.fromYmdHms(year, lunarMonth, day, h, m, 0).getSolar();
    return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay(), solar.getHour(), solar.getMinute(), solar.getSecond());
  }

  return new Date(year, month - 1, day, h, m, 0);
}

function calculateAge(birthDate, today = new Date()) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthday = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  return Math.max(hadBirthday ? age : age - 1, 0);
}

function getAgeInfo(birthDate, today = new Date()) {
  const hadBirthday = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  const fullAge = calculateAge(birthDate, today);
  return {
    fullAge,
    hadBirthday,
    birthdayStatus: hadBirthday ? "今年生日已过" : "今年生日未到",
    todayText: formatDate(today)
  };
}

function tenGod(dayStem, targetStem) {
  if (!targetStem) return "";
  const dayIndex = stems.indexOf(dayStem);
  const targetIndex = stems.indexOf(targetStem);
  const dayEl = stemElement[dayStem];
  const targetEl = stemElement[targetStem];
  const samePolarity = dayIndex % 2 === targetIndex % 2;

  if (targetEl === dayEl) return samePolarity ? "比肩" : "劫财";
  if (producingElement[dayEl] === targetEl) return samePolarity ? "食神" : "伤官";
  if (controllingElement[dayEl] === targetEl) return samePolarity ? "偏财" : "正财";
  if (controllingElement[targetEl] === dayEl) return samePolarity ? "七杀" : "正官";
  if (producingElement[targetEl] === dayEl) return samePolarity ? "偏印" : "正印";
  return "";
}

function godMeaning(god) {
  const map = {
    比肩: "自我、同辈、竞争与独立性",
    劫财: "行动力、人际竞争与资源分配",
    食神: "表达、作品、享受与稳定输出",
    伤官: "表达突破、变化意识与规则摩擦",
    偏财: "机会、客户、流动资源与现实经营",
    正财: "稳定收入、责任分配与现实安排",
    七杀: "压力、挑战、执行力与外部规则",
    正官: "秩序、职位、规范与责任",
    偏印: "学习、灵感、非标准资源与思考",
    正印: "支持、学习、贵人和安全感"
  };
  return map[god] || "阶段主题";
}

function hiddenWithGods(branch, dayStem) {
  return (hiddenStems[branch] || []).map((stem) => `${renderGanZhiPart(stem, "hidden")}${tenGod(dayStem, stem)}`).join("<br>");
}

function fillSelect(select, values, formatter = (value) => value.name || value) {
  select.innerHTML = values.map((value, index) => `<option value="${index}">${formatter(value)}</option>`).join("");
}

function selectedText(selector) {
  const select = document.querySelector(selector);
  return select?.selectedOptions?.[0]?.textContent?.replace("，默认省份", "").replace("，默认城市", "") || "";
}

function selectedNode(selector, list) {
  const index = Number(document.querySelector(selector).value || 0);
  return list[index] || list[0] || { name: "", children: [] };
}

async function loadChinaAreas() {
  const sources = [
    "china-pca.json",
    "https://cdn.jsdelivr.net/gh/modood/Administrative-divisions-of-China@master/dist/pca-code.json"
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 20) {
        chinaPlaces = data;
        return;
      }
    } catch (error) {
      console.warn(`中国行政区划数据加载失败：${source}`, error);
    }
  }

  chinaPlaces = fallbackPlaces;
}

function openSinglePayModal(options = {}) {
  const modal = document.querySelector("#payment-modal");
  const title = document.querySelector("#payment-title");
  const note = modal.querySelector(".modal-note");
  const actionButton = document.querySelector("#confirm-paid-generate");
  pendingSinglePayAction = options.onSuccess || null;
  if (title) title.textContent = options.title || "生成咨询方向解读";
  if (note) {
    note.textContent = options.description
      || "本次解读将围绕你输入的具体问题，结合命盘结构、大运流年和五行关系，生成一份专项分析建议。";
  }
  if (actionButton) actionButton.textContent = options.buttonText || "9.99 元立即解读";
  modal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeSinglePayModal({ clearAction = true } = {}) {
  document.querySelector("#payment-modal").hidden = true;
  document.body.classList.remove("modal-open");
  if (clearAction) pendingSinglePayAction = null;
}

async function onPaymentSuccess(action) {
  if (typeof action === "function") await action();
}

async function confirmSinglePay() {
  const action = pendingSinglePayAction;
  closeSinglePayModal({ clearAction: true });
  await onPaymentSuccess(action);
}

function clearSingleReadingState({ clearQuestion = true } = {}) {
  currentSingleReading = null;
  paidOrderNo = null;
  singleReadingText = "";
  singleReadingQuestion = "";
  pendingSinglePayAction = null;

  const result = document.querySelector("#consult-result");
  if (result) result.textContent = "";

  if (clearQuestion) {
    const input = document.querySelector("#consult-direction");
    if (input) input.value = "";
  }

  const modal = document.querySelector("#payment-modal");
  if (modal && !modal.hidden) closeSinglePayModal({ clearAction: true });
}

function getGuestId() {
  const key = "yan_ce_guest_id";
  let guestId = localStorage.getItem(key);
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, guestId);
  }
  return guestId;
}

function buildSingleReadingPayload(question) {
  const chart = baziState?.chart || {};
  return {
    guestId: getGuestId(),
    question,
    birthInfo: {
      calendarType: baziState?.calendarType,
      dateValue: baziState?.dateValue,
      usedSolarDate: baziState?.birthDate ? formatDate(baziState.birthDate) : "",
      timeValue: baziState?.timeValue,
      gender: document.querySelector("#gender")?.value || "",
      province: selectedText("#birth-province"),
      city: selectedText("#birth-city"),
      area: selectedText("#birth-area")
    },
    chartData: {
      pillars: chart.pillars || [],
      stems: chart.stems || [],
      branches: chart.branches || [],
      tenGods: chart.tenGods || [],
      hiddenGan: chart.hiddenGan || [],
      hiddenGods: chart.hiddenGods || [],
      stages: chart.stages || [],
      xunKong: chart.xunKong || [],
      nayin: chart.nayin || [],
      strength: baziState?.strength || null,
      shenSha: baziState?.shenSha || []
    },
    luckData: {
      currentDaYun: baziState?.currentDaYun || null,
      selectedDaYun: baziState?.selectedDaYun || null,
      currentLiuNian: baziState?.currentLiuNian || new Date().getFullYear(),
      selectedLiuNian: baziState?.selectedLiuNian || new Date().getFullYear(),
      currentLiuYue: baziState?.currentLiuYue ?? null,
      selectedLiuYue: baziState?.selectedLiuYue ?? null,
      selectedMonth: baziState?.selectedLiuNian
        ? buildFlowMonths(baziState.selectedLiuNian)[baziState.selectedLiuYue]
        : null
    }
  };
}

async function requestSingleReading(question) {
  const response = await fetch("/api/analysis/single-reading", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildSingleReadingPayload(question))
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.result) throw new Error(data?.message || "AI_GENERATION_FAILED");
  return data.result;
}

function updateCities() {
  const province = selectedNode("#birth-province", chinaPlaces);
  const cities = province.children || [];
  fillSelect(document.querySelector("#birth-city"), cities, (city) => city.name === "市辖区" ? province.name : city.name);
  updateAreas();
}

function updateAreas() {
  const province = selectedNode("#birth-province", chinaPlaces);
  const city = selectedNode("#birth-city", province.children || []);
  fillSelect(document.querySelector("#birth-area"), city.children || []);
}

function countElements(pillars) {
  const score = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  pillars.forEach((pillarValue) => {
    const { stem, branch } = splitPillar(pillarValue);
    score[stemElement[stem]] += 2;
    score[branchElement[branch]] += 2;
    (hiddenStems[branch] || []).forEach((hidden) => {
      score[stemElement[hidden]] += 1;
    });
  });
  return score;
}

function getNaYinForPillar(pillar) {
  return window.LunarUtil?.NAYIN?.[pillar] || "";
}

function getFlowYearPillar(year) {
  return Solar.fromYmdHms(year, 7, 1, 12, 0, 0).getLunar().getYearInGanZhiExact();
}

function getFlowMonthPillar(year, month) {
  return Solar.fromYmdHms(year, month, 15, 12, 0, 0).getLunar().getMonthInGanZhiExact();
}

function getFlowMonth(year, index) {
  const monthDates = [
    [year, 2, 15],
    [year, 3, 15],
    [year, 4, 15],
    [year, 5, 15],
    [year, 6, 15],
    [year, 7, 15],
    [year, 8, 15],
    [year, 9, 15],
    [year, 10, 15],
    [year, 11, 15],
    [year, 12, 15],
    [year + 1, 1, 15]
  ];
  const [solarYear, solarMonth, solarDay] = monthDates[index];
  const pillar = Solar.fromYmdHms(solarYear, solarMonth, solarDay, 12, 0, 0).getLunar().getMonthInGanZhiExact();
  return {
    index,
    year,
    label: monthLabels[index],
    pillar,
    stem: pillar.slice(0, 1),
    branch: pillar.slice(1, 2)
  };
}

function buildFlowMonths(year) {
  return monthLabels.map((_, index) => getFlowMonth(year, index));
}

function getStemRelation(sourceStem, targetStem) {
  const sourceElement = stemElement[sourceStem];
  const targetElement = stemElement[targetStem];
  const pair = [sourceStem, targetStem].sort((a, b) => stems.indexOf(a) - stems.indexOf(b)).join("");
  const relation = [];

  if (stemCombinations[pair]) relation.push(stemCombinations[pair]);
  if (sourceElement === targetElement) relation.push("同五行比助");
  if (producingElement[sourceElement] === targetElement) relation.push(`${sourceStem}${sourceElement}生${targetStem}${targetElement}`);
  if (producingElement[targetElement] === sourceElement) relation.push(`${targetStem}${targetElement}生${sourceStem}${sourceElement}`);
  if (controllingElement[sourceElement] === targetElement) relation.push(`${sourceStem}${sourceElement}克${targetStem}${targetElement}`);
  if (controllingElement[targetElement] === sourceElement) relation.push(`${targetStem}${targetElement}克${sourceStem}${sourceElement}`);

  return relation;
}

function getBranchRelation(sourceBranch, targetBranch) {
  const pair = [sourceBranch, targetBranch].sort((a, b) => branches.indexOf(a) - branches.indexOf(b)).join("");
  const direct = [];

  Object.entries(branchRelations).forEach(([name, combos]) => {
    if (name === "三合" || name === "三会") return;
    if (combos.some((combo) => combo.split("").sort((a, b) => branches.indexOf(a) - branches.indexOf(b)).join("") === pair)) {
      direct.push(`${sourceBranch}${targetBranch}${name}`);
    }
  });

  return direct;
}

function getGroupRelations(allBranches) {
  const relations = [];
  ["三合", "三会"].forEach((name) => {
    branchRelations[name].forEach((combo) => {
      const chars = combo.split("");
      if (chars.every((branch) => allBranches.includes(branch))) relations.push(`${combo}${name}`);
    });
  });
  return relations;
}

function relationSummary(targetPillar, chart, extraBranches = []) {
  const target = splitPillar(targetPillar);
  const stemTexts = [];
  const branchTexts = [];
  const labels = ["年", "月", "日", "时"];

  chart.stems.forEach((stem, index) => {
    const rels = getStemRelation(target.stem, stem);
    rels.forEach((rel) => {
      if (rel.includes("合")) stemTexts.push(`${target.stem}与${stem}成${rel}，说明对应主题容易互相牵引，需要看是否能化成有用之气。`);
      else if (rel.includes("生")) stemTexts.push(`${target.stem}与${labels[index]}干${stem}有相生关系，代表资源、想法或行动上有承接。`);
      else if (rel.includes("克")) stemTexts.push(`${target.stem}与${labels[index]}干${stem}有相克关系，事情推进时更容易出现规则、压力或取舍。`);
      else stemTexts.push(`${target.stem}与${labels[index]}干${stem}同气，相关主题会被放大。`);
    });
  });

  chart.branches.forEach((branch, index) => {
    const rels = getBranchRelation(target.branch, branch);
    rels.forEach((rel) => {
      if (rel.includes("冲")) branchTexts.push(`${target.branch}与${labels[index]}支${branch}形成${rel}，容易引动变化、奔波或关系位置调整。`);
      else if (rel.includes("合")) branchTexts.push(`${target.branch}与${labels[index]}支${branch}形成${rel}，资源和关系有聚合倾向，但仍要看喜忌。`);
      else if (rel.includes("刑")) branchTexts.push(`${target.branch}与${labels[index]}支${branch}形成${rel}，做事容易有卡点，适合降低急躁。`);
      else if (rel.includes("害") || rel.includes("破")) branchTexts.push(`${target.branch}与${labels[index]}支${branch}形成${rel}，细节、人情或合作边界需要更清楚。`);
      else branchTexts.push(`${target.branch}与${labels[index]}支${branch}形成${rel}，相关主题会被带动。`);
    });
  });

  const groupBranches = [...chart.branches, ...extraBranches, target.branch].filter(Boolean);
  getGroupRelations(groupBranches).forEach((rel) => {
    branchTexts.push(`${rel}成立，代表某一类五行气势被聚合，影响会比单个地支更明显。`);
  });

  return {
    stems: stemTexts.length ? stemTexts : ["天干未见特别强的五合或生克，先按十神和五行气势观察。"],
    branches: branchTexts.length ? branchTexts : ["地支未见明显冲合刑害破，阶段主题相对不以突发变化为主。"]
  };
}
function natalRelationSummary(chart) {
  const stemTexts = [];
  const branchTexts = [];
  const labels = ["年", "月", "日", "时"];

  chart.stems.forEach((stem, index) => {
    chart.stems.slice(index + 1).forEach((nextStem, nextOffset) => {
      getStemRelation(stem, nextStem).forEach((text) => {
        stemTexts.push(`${labels[index]}干${stem}与${labels[index + nextOffset + 1]}干${nextStem}：${text}`);
      });
    });
  });

  chart.branches.forEach((branch, index) => {
    chart.branches.slice(index + 1).forEach((nextBranch, nextOffset) => {
      getBranchRelation(branch, nextBranch).forEach((text) => {
        branchTexts.push(`${labels[index]}支${branch}与${labels[index + nextOffset + 1]}支${nextBranch}：${text}`);
      });
    });
  });

  const groupTexts = getGroupRelations(chart.branches);
  return {
    stems: stemTexts.length ? stemTexts : ["原局天干未见明显五合，主要看五行生克与十神配置。"],
    branches: [...branchTexts, ...groupTexts].length ? [...branchTexts, ...groupTexts] : ["原局地支未见明显六合、三合、三会、六冲、六害、相刑或相破。"]
  };
}

function branchGroup(branch) {
  return Object.keys(shenShaRules.桃花).find((group) => group.includes(branch)) || "";
}

function getShenSha(chart, contextPillars = []) {
  const dayBranch = chart.branches[2];
  const dayStem = chart.stems[2];
  const yearBranch = chart.branches[0];
  const group = branchGroup(dayBranch);
  const positions = [
    ...chart.pillars.map((pillar, index) => ({ label: ["年柱", "月柱", "日柱", "时柱"][index], pillar, branch: pillar.slice(1, 2) })),
    ...contextPillars.map((item) => ({ label: item.label, pillar: item.pillar, branch: item.pillar.slice(1, 2) }))
  ];
  const result = [];
  const add = (name, targetBranches, meaning) => {
    positions.forEach((position) => {
      if (targetBranches.filter(Boolean).includes(position.branch)) {
        result.push(`${name}在${position.label}${position.pillar}：${meaning}`);
      }
    });
  };

  if (group) {
    Object.entries(shenShaRules).forEach(([name, table]) => {
      add(name, [table[group]], {
        桃花: "人缘、审美、情感互动增强，也要防关系分心。",
        驿马: "变动、奔波、迁移、出差或转换环境。",
        华盖: "思考、专业、孤独感、宗教玄学或审美倾向。",
        将星: "主见、组织力、掌控欲和承担责任。",
        灾煞: "外部阻力、突发变化，需降低冒进。",
        劫煞: "竞争、损耗、被动变化，财务和合作需谨慎。"
      }[name]);
    });
  }

  add("天乙贵人", tianYi[dayStem] || [], "贵人助力、遇事较易得到支持。");
  add("文昌贵人", [wenChang[dayStem]], "学习、表达、证书、方案能力较容易发挥。");
  add("羊刃", [yangRen[dayStem]], "行动力强但也容易急躁，需注意边界和安全。");
  add("禄神", [luShen[dayStem]], "资源、职位、收入基础或自我掌控力。");

  contextPillars.forEach((item) => {
    if (!item?.pillar) return;
    const branch = item.pillar.slice(1, 2);
    if (item.label === "流年") {
      result.push(`太岁在${item.label}${item.pillar}：当年地支主一年外部主题，宜结合原局喜忌判断。`);
      const opposite = branches[mod(branches.indexOf(branch) + 6, 12)];
      if (positions.some((position) => position.branch === opposite)) {
        result.push(`岁破被引动：流年${branch}冲命局${opposite}，容易带来调整、奔波或关系变化。`);
      }
    }
  });

  chart.xunKong.forEach((value, index) => {
    if (value) result.push(`空亡在${["年柱", "月柱", "日柱", "时柱"][index]}${chart.pillars[index]}：对应事务有虚、迟、反复或需落地验证。`);
  });

  return result.length ? [...new Set(result)] : ["未见明显常用神煞；神煞只作辅助参考，仍以五行、十神、生克制化为主。"];
}
function briefShenSha(chart, label, pillar) {
  const texts = getShenSha(chart, [{ label, pillar }])
    .filter((text) => text.includes(`在${label}${pillar}`))
    .map((text) => text.split("在")[0]);
  return texts.length ? [...new Set(texts)].join("、") : "参考";
}

function analyzeStrength(chart) {
  const dayStem = chart.stems[2];
  const dayElement = stemElement[dayStem];
  const monthElement = branchElement[chart.branches[1]];
  const supportElements = [dayElement, Object.keys(producingElement).find((element) => producingElement[element] === dayElement)];
  const score = { support: 0, drain: 0 };
  const reasons = [];

  if (monthElement === dayElement) {
    score.support += 3;
    reasons.push(`日主为${dayStem}${dayElement}，月令${chart.branches[1]}属${monthElement}，得令，月令帮身力量最大。`);
  } else if (producingElement[monthElement] === dayElement) {
    score.support += 2.2;
    reasons.push(`月令${chart.branches[1]}属${monthElement}生扶日主${dayElement}，得生有力。`);
  } else {
    score.drain += producingElement[dayElement] === monthElement ? 1.8 : 2.5;
    reasons.push(`月令${chart.branches[1]}属${monthElement}，对日主${dayElement}不是直接帮扶，月令上不占优势。`);
  }

  chart.hiddenGan.forEach((gans, index) => {
    if (gans.includes(dayStem)) {
      score.support += index === 2 ? 1.8 : 1.2;
      reasons.push(`${["年", "月", "日", "时"][index]}支藏干见${dayStem}，日主有根。`);
    }
    gans.forEach((gan) => {
      const element = stemElement[gan];
      if (supportElements.includes(element)) score.support += 0.35;
      if (controllingElement[element] === dayElement || producingElement[dayElement] === element || controllingElement[dayElement] === element) score.drain += 0.25;
    });
  });

  chart.stems.forEach((stem, index) => {
    if (index === 2) return;
    const element = stemElement[stem];
    if (element === dayElement) {
      score.support += 0.9;
      reasons.push(`天干透出${stem}${element}，比劫帮身。`);
    } else if (producingElement[element] === dayElement) {
      score.support += 1;
      reasons.push(`天干透出${stem}${element}，印星生扶日主。`);
    } else if (controllingElement[element] === dayElement) {
      score.drain += 1.1;
      reasons.push(`天干透出${stem}${element}，对日主形成官杀克身。`);
    } else if (producingElement[dayElement] === element) {
      score.drain += 0.9;
      reasons.push(`天干透出${stem}${element}，食伤泄身。`);
    } else if (controllingElement[dayElement] === element) {
      score.drain += 0.8;
      reasons.push(`天干透出${stem}${element}，财星耗身。`);
    }
  });

  const elementScore = countElements(chart.pillars);
  const supportTotal = supportElements.reduce((sum, element) => sum + elementScore[element], 0);
  const drainTotal = Object.entries(elementScore).filter(([element]) => !supportElements.includes(element)).reduce((sum, [, value]) => sum + value, 0);
  if (supportTotal >= drainTotal) score.support += 1;
  else score.drain += 1;

  let type = "中和";
  if (score.support - score.drain >= 4) type = "偏强";
  if (score.drain - score.support >= 3) type = "偏弱";
  if (score.support >= 8 && score.drain <= 2) type = "从强";
  if (score.drain >= 8 && score.support <= 2) type = "从弱";

  const useful = type === "偏弱" || type === "从弱"
    ? `喜${supportElements.join("、")}帮扶，忌克泄耗过重。`
    : type === "偏强" || type === "从强"
      ? `喜财官食伤疏泄制化，忌${supportElements.join("、")}继续过旺。`
      : "喜忌需看岁运引动，整体以平衡流通为先。";

  return {
    type,
    useful,
    reasons: reasons.slice(0, 5),
    score,
    elementScore
  };
}

function makeAdvice(god, branchRelationsText, strengthType) {
  const pressure = branchRelationsText.some((text) => /冲|刑|害|破/.test(text));
  const support = ["正印", "偏印", "比肩", "劫财"].includes(god);
  const wealth = ["正财", "偏财"].includes(god);
  const career = ["正官", "七杀"].includes(god);
  const output = ["食神", "伤官"].includes(god);

  return {
    overall: pressure ? "整体偏动，容易有调整和推进压力，适合先稳住节奏再做选择。" : support ? "整体偏稳，适合补资源、学习、修复关系和慢慢蓄力。" : "整体可以顺势推进，但重要事仍建议留出缓冲。",
    career: career ? "事业上责任感和规则感增强，适合处理岗位、制度、合作规范类事项。" : output ? "事业上更适合表达、方案、作品或对外沟通，但要避免和规则硬碰。" : "事业以稳步推进为主，可以关注已有资源的复盘和整合。",
    wealth: wealth ? "财务议题会更明显，适合关注正向收入、回款和预算安排，不宜把高风险投入放得过重。" : pressure ? "财运以稳为主，容易因变化产生额外支出，适合先控制节奏。" : "财务适合保守规划，先保证现金流和日常安排稳定。",
    love: pressure ? "感情互动中容易因节奏和表达方式不同产生误会，适合多沟通、少用情绪判断。" : wealth ? "感情中现实议题会增加，适合把边界、承诺和期待说清楚。" : "关系宜稳定沟通，不必急着下结论。",
    network: pressure ? "人际合作需要把责任、时间和边界讲清楚，避免过度卷入。" : support ? "人际上较容易得到同辈或长辈支持，但也要保持独立判断。" : "人际以互惠和清晰表达为佳。",
    health: pressure ? "健康方面以作息、情绪和压力管理为主，出行运动时留意安全，不做具体疾病判断。" : strengthType.includes("弱") ? "体力和恢复节奏需要关注，适合规律作息、减少透支。" : "健康重点是避免过劳和饮食作息失衡。"
  };
}
function renderDetailHtml(title, sections) {
  return `<strong>${title}</strong><div class="detail-sections">${sections.map((section) => `<div class="detail-item"><b>${section.label}</b>${section.content}</div>`).join("")}</div>`;
}
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatHiddenGan(gans, gods) {
  return gans.map((gan, index) => `<span class="mini-gan">${renderGanZhiPart(gan, "hidden")}${gods[index] || ""}</span>`).join("");
}

function timePillarFromDayStem(dayStem, hour, minute) {
  const zhiIndex = window.LunarUtil.getTimeZhiIndex(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  const dayIndex = stems.indexOf(dayStem);
  const gan = stems[(dayIndex % 5 * 2 + zhiIndex) % 10];
  const zhi = branches[zhiIndex];
  return gan + zhi;
}

function buildAccurateChart(date, gender, ziDayMode = "23") {
  if (!window.Solar) {
    throw new Error("lunar.js 未加载，无法计算八字。");
  }

  const solar = Solar.fromYmdHms(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  );
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  const daySect = ziDayMode === "23" ? 1 : 2;
  eightChar.setSect(daySect);
  const yun = eightChar.getYun(gender === "男" ? 1 : 0, 2);

  let timePillar = eightChar.getTime();
  if (ziDayMode === "0") {
    timePillar = timePillarFromDayStem(eightChar.getDayGan(), date.getHours(), date.getMinutes());
  }
  const timeStem = timePillar.slice(0, 1);
  const timeBranch = timePillar.slice(1, 2);
  const pillars = [eightChar.getYear(), eightChar.getMonth(), eightChar.getDay(), timePillar];
  const chartStems = [eightChar.getYearGan(), eightChar.getMonthGan(), eightChar.getDayGan(), timeStem];
  const chartBranches = [eightChar.getYearZhi(), eightChar.getMonthZhi(), eightChar.getDayZhi(), timeBranch];
  const yearStem = eightChar.getYearGan();
  const yearYinYang = stems.indexOf(yearStem) % 2 === 0 ? "阳" : "阴";
  const directionRule = gender === "男"
    ? (yearYinYang === "阳" ? "男阳顺" : "男阴逆")
    : (yearYinYang === "阴" ? "女阴顺" : "女阳逆");

  return {
    solar,
    lunar,
    eightChar,
    ziDayMode,
    pillars,
    stems: chartStems,
    branches: chartBranches,
    hiddenGan: [
      eightChar.getYearHideGan(),
      eightChar.getMonthHideGan(),
      eightChar.getDayHideGan(),
      hiddenStems[timeBranch] || []
    ],
    hiddenGods: [
      eightChar.getYearShiShenZhi(),
      eightChar.getMonthShiShenZhi(),
      eightChar.getDayShiShenZhi(),
      (hiddenStems[timeBranch] || []).map((stem) => tenGod(eightChar.getDayGan(), stem))
    ],
    tenGods: [
      eightChar.getYearShiShenGan(),
      eightChar.getMonthShiShenGan(),
      eightChar.getDayShiShenGan(),
      tenGod(eightChar.getDayGan(), timeStem)
    ],
    stages: [
      eightChar.getYearDiShi(),
      eightChar.getMonthDiShi(),
      eightChar.getDayDiShi(),
      eightChar.getTimeDiShi()
    ],
    xunKong: [
      eightChar.getYearXunKong(),
      eightChar.getMonthXunKong(),
      eightChar.getDayXunKong(),
      window.LunarUtil.getXunKong(timePillar)
    ],
    nayin: [
      eightChar.getYearNaYin(),
      eightChar.getMonthNaYin(),
      eightChar.getDayNaYin(),
      getNaYinForPillar(timePillar)
    ],
    yun: {
      forward: yun.isForward(),
      startYear: yun.getStartYear(),
      startMonth: yun.getStartMonth(),
      startDay: yun.getStartDay(),
      startHour: yun.getStartHour(),
      startSolar: yun.getStartSolar().toYmdHms(),
      directionRule,
      directionReason: `年干${yearStem}为${yearYinYang}干，性别为${gender}，按男阳顺、女阴顺、男阴逆、女阳逆，故为${yun.isForward() ? "顺行" : "逆行"}。`
    },
    daYun: yun.getDaYun(14).map((item) => ({
      index: item.getIndex(),
      ganZhi: item.getGanZhi(),
      startYear: item.getStartYear(),
      endYear: item.getEndYear(),
      startAge: item.getStartAge(),
      endAge: item.getEndAge(),
      current: false,
      xunKong: item.getGanZhi() ? item.getXunKong() : ""
    }))
  };
}

function updateProfessionalRows(chart, selectedYear, selectedDaYun) {
  const keys = ["flow", "luck", "year", "month", "day", "hour"];
  const dayStem = chart.stems[2];
  const flowPillar = getFlowYearPillar(selectedYear);
  const viewedLuck = selectedDaYun || chart.daYun.find((item) => item.index > 0) || { ganZhi: "" };
  const luckPillar = viewedLuck.ganZhi || flowPillar;
  const allPillars = [flowPillar, luckPillar, ...chart.pillars];

  keys.forEach((key, index) => {
    const item = splitPillar(allPillars[index]);
    document.querySelector(`#star-${key}`).textContent = key === "day" ? "日主" : tenGod(dayStem, item.stem);
    document.querySelector(`#stem-${key}`).innerHTML = renderGanZhiPart(item.stem, "stem");
    document.querySelector(`#branch-${key}`).innerHTML = renderGanZhiPart(item.branch, "branch");
    document.querySelector(`#hidden-${key}`).innerHTML = index >= 2
      ? formatHiddenGan(chart.hiddenGan[index - 2], chart.hiddenGods[index - 2])
      : hiddenWithGods(item.branch, dayStem);
    document.querySelector(`#stage-${key}`).textContent = index >= 2 ? chart.stages[index - 2] : stages[mod(branches.indexOf(item.branch), stages.length)];
    document.querySelector(`#self-${key}`).textContent = index >= 2 ? chart.stages[index - 2] : stages[mod(branches.indexOf(item.branch) + 4, stages.length)];
    document.querySelector(`#void-${key}`).textContent = index >= 2
      ? chart.xunKong[index - 2]
      : (key === "luck" ? viewedLuck.xunKong : window.LunarUtil.getXunKong(allPillars[index]));
    document.querySelector(`#nayin-${key}`).textContent = index >= 2 ? chart.nayin[index - 2] : getNaYinForPillar(allPillars[index]);
    const shaText = index >= 2
      ? briefShenSha(chart, ["年柱", "月柱", "日柱", "时柱"][index - 2], allPillars[index])
      : briefShenSha(chart, key === "flow" ? "流年" : "大运", allPillars[index]);
    document.querySelector(`#sha-${key}`).innerHTML = renderShaChips(shaText);
  });
}

function renderMobilePillarCards(chart) {
  const container = document.querySelector("#mobile-pillar-cards");
  if (!container) return;
  const labels = ["年柱", "月柱", "日柱", "时柱"];
  container.innerHTML = chart.pillars.map((pillar, index) => {
    const { stem, branch } = splitPillar(pillar);
    const hidden = formatHiddenGan(chart.hiddenGan[index], chart.hiddenGods[index]) || "无";
    const sha = renderShaChips(briefShenSha(chart, labels[index], pillar));
    const dayMark = index === 2 ? `<small class="pillar-mark">日主</small>` : "";
    return `
      <article class="mobile-pillar-card">
        <header><span>${labels[index]}</span>${dayMark}<strong>${renderGanZhi(pillar)}</strong></header>
        <dl>
          <div><dt>天干</dt><dd>${renderGanZhiPart(stem, "stem")}</dd></div>
          <div><dt>地支</dt><dd>${renderGanZhiPart(branch, "branch")}</dd></div>
          <div><dt>藏干</dt><dd>${hidden}</dd></div>
          <div><dt>星运</dt><dd>${chart.stages[index]}</dd></div>
          <div><dt>自坐</dt><dd>${chart.stages[index]}</dd></div>
          <div><dt>空亡</dt><dd>${chart.xunKong[index] || "无"}</dd></div>
          <div><dt>纳音</dt><dd>${chart.nayin[index] || "无"}</dd></div>
          <div class="wide"><dt>神煞</dt><dd>${sha}</dd></div>
        </dl>
      </article>
    `;
  }).join("");
}

function renderTermTips(chart, shenSha = []) {
  const container = document.querySelector("#term-tip-list");
  if (!container) return;
  const rawTerms = [
    ...chart.tenGods,
    ...shenSha.flatMap((item) => String(item).split(/[在：、\s]+/)),
    "藏干",
    "星运",
    "纳音",
    "空亡"
  ].filter(Boolean);
  const terms = [...new Set(rawTerms.filter((term) => termDescriptions[term]))].slice(0, 5);
  container.innerHTML = terms.map((term) => `
    <span class="term-pill"><b>${escapeHtml(term)}</b>${escapeHtml(explainTerm(term))}</span>
  `).join("") || `<span class="term-pill"><b>术语说明</b>暂无详细说明。</span>`;
}

function isLuckInYear(item, year) {
  return item?.index > 0 && year >= item.startYear && year <= item.endYear;
}

function getActiveLuck(chart, currentAge, currentYear = new Date().getFullYear()) {
  return chart.daYun.find((item) => isLuckInYear(item, currentYear))
    || chart.daYun.find((item) => item.index > 0);
}

function scoreTrend(relations, god, strengthType) {
  let score = 70;
  score -= relations.branches.filter((text) => /冲|刑|害|破/.test(text)).length * 7;
  score += relations.branches.filter((text) => /合|会/.test(text)).length * 4;
  if (strengthType.includes("弱") && ["正印", "偏印", "比肩", "劫财"].includes(god)) score += 8;
  if ((strengthType.includes("强") || strengthType.includes("从强")) && ["正官", "七杀", "正财", "偏财", "食神", "伤官"].includes(god)) score += 6;
  if (["七杀", "伤官", "劫财"].includes(god)) score -= 3;
  const bounded = Math.max(35, Math.min(92, score));
  return bounded >= 78 ? `${bounded}分，偏助力` : bounded >= 60 ? `${bounded}分，平中有动` : `${bounded}分，偏压力`;
}

function relationListText(list, limit = 3) {
  return list.slice(0, limit).join("<br>");
}

function usefulElements(strength, dayStem) {
  const dayElement = stemElement[dayStem];
  const sealElement = Object.keys(producingElement).find((element) => producingElement[element] === dayElement);
  if (strength.type.includes("弱")) return [sealElement, dayElement].filter(Boolean);
  if (strength.type.includes("强")) return [producingElement[dayElement], controllingElement[dayElement]].filter(Boolean);
  return [sealElement, producingElement[dayElement]].filter(Boolean);
}

function directionAdvice(chart, strength) {
  const map = {
    木: "东方、东南",
    火: "南方",
    土: "中部、西南、东北",
    金: "西方、西北",
    水: "北方"
  };
  const useful = usefulElements(strength, chart.stems[2]);
  const cautious = Object.keys(map).filter((element) => !useful.includes(element) && element !== stemElement[chart.stems[2]]).slice(0, 2);
  return `方位只作参考。此盘可优先参考${useful.map((element) => map[element]).join("、")}等方向；${cautious.map((element) => map[element]).join("、")}相关环境可谨慎评估，不做绝对结论。`;
}

function focusYearsInLuck(luck, chart, limit = 4) {
  if (!luck?.startYear) return "暂无明确重点流年。";
  const years = [];
  for (let year = luck.startYear; year <= luck.endYear; year += 1) {
    const pillar = getFlowYearPillar(year);
    const rel = relationSummary(pillar, chart, [luck.ganZhi.slice(1, 2)]).branches;
    if (rel.some((text) => /冲|刑|害|破|合|会/.test(text))) years.push(`${year} ${pillar}`);
  }
  return years.slice(0, limit).join("、") || "该步大运中未见特别集中的冲合年份，可按年度流年细看。";
}

function monthRiskText(year, chart, yearPillar) {
  const months = buildFlowMonths(year).filter((month) => {
    const rel = relationSummary(month.pillar, chart, [yearPillar.slice(1, 2)]).branches;
    return rel.some((text) => /冲|刑|害|破/.test(text));
  });
  return months.slice(0, 4).map((month) => `${month.label}${month.pillar}`).join("、") || "未见特别强的冲刑害破月份。";
}

function renderCycleDetail(type, data, chart, currentYear, currentAge) {
  const detail = document.querySelector("#cycle-detail");
  const dayStem = chart.stems[2];
  const strength = analyzeStrength(chart);
  const selectedYear = baziState?.selectedLiuNian || data.year || currentYear;
  const selectedLuck = baziState?.selectedDaYun || data.luck || getActiveLuck(chart, currentAge || 0, selectedYear);

  if (type === "luck") {
    const god = tenGod(dayStem, data.ganZhi.slice(0, 1));
    const relations = relationSummary(data.ganZhi, chart);
    const advice = makeAdvice(god, relations.branches, strength.type);
    const sha = getShenSha(chart, [{ label: "大运", pillar: data.ganZhi }]).slice(0, 4).join("<br>");
    detail.innerHTML = renderDetailHtml(`当前查看大运：${renderGanZhi(data.ganZhi)}（${data.startYear}-${data.endYear}，${data.startAge}-${data.endAge}岁）`, [
      { label: "大运总评", content: `此步大运天干为${god}，主题偏向${godMeaning(god)}。${advice.overall}` },
      { label: "与原局关系", content: `${relationListText(relations.stems, 2)}<br>${relationListText(relations.branches, 3)}` },
      { label: "喜忌判断", content: strength.type.includes("弱") ? "日主偏弱时，能生扶日主的大运更容易成为助力；克泄耗过重时压力会增加。" : "日主不弱时，更重视大运是否让五行流通、责任和表达是否平衡。" },
      { label: "事项倾向", content: `事业/财运：${godMeaning(god)}相关主题较明显，具体决策可在专项解读中展开。` },
      { label: "互动提示", content: "关系、人际和健康类内容仅作基础提示，具体问题建议在下方输入后生成专项解读。" },
      { label: "重点流年", content: focusYearsInLuck(data, chart) },
      { label: "神煞参考", content: `${sha}<br>神煞只是辅助参考，不单独定吉凶。` }
    ]);
    document.querySelector("#luck-cycle").innerHTML = `当前查看大运：${renderGanZhi(data.ganZhi)}`;
    return;
  }

  if (type === "year") {
    const pillar = getFlowYearPillar(data.year);
    const activeLuck = data.luck || selectedLuck;
    const god = tenGod(dayStem, pillar.slice(0, 1));
    const relations = relationSummary(pillar, chart, activeLuck?.ganZhi ? [activeLuck.ganZhi.slice(1, 2)] : []);
    const advice = makeAdvice(god, relations.branches, strength.type);
    const sha = getShenSha(chart, [
      activeLuck?.ganZhi ? { label: "大运", pillar: activeLuck.ganZhi } : null,
      { label: "流年", pillar }
    ].filter(Boolean)).slice(0, 5).join("<br>");
    detail.innerHTML = renderDetailHtml(`当前查看流年：${data.year}年 ${renderGanZhi(pillar)}（结合${activeLuck?.ganZhi || "待定"}大运）`, [
      { label: "流年总评", content: `流年天干为${god}，评分参考：${scoreTrend(relations, god, strength.type)}。${advice.overall}` },
      { label: "与命局和大运", content: `${relationListText(relations.stems, 2)}<br>${relationListText(relations.branches, 3)}` },
      { label: "基础倾向", content: `流年十神为${god}，只作年度主题提示，专项建议需结合你的具体问题生成。` },
      { label: "关系提示", content: `可重点观察这些月份：${monthRiskText(data.year, chart, pillar)}。` },
      { label: "方位基础", content: directionAdvice(chart, strength) },
      { label: "神煞参考", content: `${sha}<br>神煞只作参考，仍以命局和岁运作用为主。` }
    ]);
    document.querySelector("#luck-cycle").innerHTML = `当前查看流年：${data.year}年 ${renderGanZhi(pillar)}`;
    return;
  }

  if (type === "month") {
    const activeLuck = data.luck || selectedLuck;
    const yearPillar = data.yearPillar || getFlowYearPillar(selectedYear);
    const god = tenGod(dayStem, data.pillar.slice(0, 1));
    const relations = relationSummary(data.pillar, chart, [activeLuck?.ganZhi?.slice(1, 2), yearPillar.slice(1, 2)].filter(Boolean));
    const advice = makeAdvice(god, relations.branches, strength.type);
    const sha = getShenSha(chart, [
      activeLuck?.ganZhi ? { label: "大运", pillar: activeLuck.ganZhi } : null,
      { label: "流年", pillar: yearPillar },
      { label: "流月", pillar: data.pillar }
    ].filter(Boolean)).slice(0, 5).join("<br>");
    detail.innerHTML = renderDetailHtml(`当前查看流月：${data.label} ${renderGanZhi(data.pillar)}（${selectedYear}年，结合${activeLuck?.ganZhi || "待定"}大运）`, [
      { label: "流月总评", content: `流月天干为${god}。${advice.overall}` },
      { label: "流月关系", content: `${relationListText(relations.stems, 2)}<br>${relationListText(relations.branches, 3)}` },
      { label: "基础倾向", content: `流月天干为${god}，代表${godMeaning(god)}相关主题被看见。` },
      { label: "关系提示", content: "本月只展示基础关系，具体行动建议请在咨询方向中生成专项解读。" },
      { label: "神煞参考", content: `${sha}<br>神煞只作参考，不单独定吉凶。` }
    ]);
    document.querySelector("#luck-cycle").innerHTML = `当前查看流月：${renderGanZhi(data.pillar)}`;
  }
}
function setSelectedCycle(container, card) {
  container.querySelectorAll(".cycle-card").forEach((item) => item.classList.remove("is-selected"));
  card.classList.add("is-selected");
}

function monthIndexForYear(year) {
  return year === baziState.currentLiuNian ? baziState.currentLiuYue : 0;
}

function cycleBadges(isCurrent, isSelected, currentLabel) {
  const badges = [];
  if (isCurrent) badges.push(`<small class="cycle-badge">${currentLabel}</small>`);
  if (isSelected) badges.push(`<small class="cycle-badge cycle-badge--view">正在查看</small>`);
  return badges.length ? `<span class="cycle-badges">${badges.join("")}</span>` : "";
}

function updateCycleStatus() {
  if (!baziState) return;
  const currentLuck = baziState.currentDaYun;
  const selectedLuck = baziState.selectedDaYun;
  const selectedYearPillar = getFlowYearPillar(baziState.selectedLiuNian);
  const currentYearPillar = getFlowYearPillar(baziState.currentLiuNian);
  const selectedMonth = buildFlowMonths(baziState.selectedLiuNian)[baziState.selectedLiuYue];
  const currentMonth = buildFlowMonths(baziState.currentLiuNian)[baziState.currentLiuYue];
  document.querySelector("#selected-luck-status").textContent = selectedLuck?.index === currentLuck?.index
    ? `当前查看：${selectedLuck?.ganZhi || "待定"}大运（当前大运）`
    : `当前查看：${selectedLuck?.ganZhi || "待定"}大运；真实当前：${currentLuck?.ganZhi || "待定"}大运`;
  document.querySelector("#selected-year-status").textContent = baziState.selectedLiuNian === baziState.currentLiuNian
    ? `当前查看：${baziState.selectedLiuNian}年${selectedYearPillar}（当前流年）`
    : `当前查看：${baziState.selectedLiuNian}年${selectedYearPillar}；真实当前：${baziState.currentLiuNian}年${currentYearPillar}`;
  document.querySelector("#selected-month-status").textContent =
    `当前查看：${selectedMonth?.label || ""}${selectedMonth?.pillar || ""}${baziState.selectedLiuNian === baziState.currentLiuNian && baziState.selectedLiuYue === baziState.currentLiuYue ? "（当前流月）" : `；真实当前：${currentMonth?.label || ""}${currentMonth?.pillar || ""}`}`;
}

function scrollSelectedIntoView() {
  ["#luck-track", "#year-track", "#month-track"].forEach((selector) => {
    const track = document.querySelector(selector);
    const selected = track?.querySelector(".is-selected");
    if (!track || !selected) return;
    const targetLeft = selected.offsetLeft - (track.clientWidth - selected.clientWidth) / 2;
    track.scrollLeft = Math.max(0, targetLeft);
  });
}

function renderFlowMonths(year, chart, activeLuck, yearPillar, currentAge, autoRender = true, shouldScroll = true) {
  const dayStem = chart.stems[2];
  const monthTrack = document.querySelector("#month-track");
  const months = buildFlowMonths(year);
  const selectedMonthIndex = baziState?.selectedLiuYue ?? (year === new Date().getFullYear() ? mod(new Date().getMonth() - 1, 12) : 0);

  monthTrack.innerHTML = months.map((month, index) => {
    const isCurrent = baziState && year === baziState.currentLiuNian && index === baziState.currentLiuYue;
    const isSelected = index === selectedMonthIndex;
    const selected = `${isCurrent ? " is-current is-active" : ""}${isSelected ? " is-selected" : ""}`;
    return `<button class="cycle-card${selected}" type="button" data-cycle="month" data-year="${year}" data-month="${index}"><span>${month.label}</span>${cycleBadges(isCurrent, isSelected, "当前流月")}<strong>${renderGanZhi(month.pillar)}</strong><em>${tenGod(dayStem, month.stem)}</em></button>`;
  }).join("");

  monthTrack.querySelectorAll("[data-cycle='month']").forEach((card) => {
    card.addEventListener("click", () => {
      baziState.selectedLiuYue = Number(card.dataset.month);
      refreshSelectionView("month", false);
    });
  });

  if (autoRender) {
    const selectedMonth = months[selectedMonthIndex] || months[0];
    renderCycleDetail("month", { ...selectedMonth, luck: activeLuck, yearPillar, year }, chart, year, currentAge);
  }
  if (shouldScroll) scrollSelectedIntoView();
}

function bindCycleInteractions(chart, currentYear, currentAge, birthYear) {
  const luckTrack = document.querySelector("#luck-track");
  const yearTrack = document.querySelector("#year-track");

  luckTrack.querySelectorAll("[data-cycle='luck']").forEach((card) => {
    card.addEventListener("click", () => {
      const item = chart.daYun.find((luck) => String(luck.index) === card.dataset.index);
      if (!item) return;
      baziState.selectedDaYun = item;
      refreshSelectionView("luck", false);
    });
  });

  yearTrack.querySelectorAll("[data-cycle='year']").forEach((card) => {
    card.addEventListener("click", () => {
      baziState.selectedLiuNian = Number(card.dataset.year);
      baziState.selectedLiuYue = monthIndexForYear(baziState.selectedLiuNian);
      refreshSelectionView("year", false);
    });
  });
}

function renderCycles(currentAge, currentYear, chart, birthYear, autoRender = true, shouldScroll = true) {
  const dayStem = chart.stems[2];
  const selectedLuckIndex = baziState?.selectedDaYun?.index;
  const currentLuckIndex = baziState?.currentDaYun?.index;
  document.querySelector("#luck-track").innerHTML = chart.daYun
    .filter((item) => item.index > 0 && item.startAge <= 110)
    .map((item) => {
      const isCurrent = item.index === currentLuckIndex && isLuckInYear(item, baziState.currentLiuNian);
      const isSelected = item.index === selectedLuckIndex;
      const active = `${isCurrent ? " is-current is-active" : ""}${isSelected ? " is-selected" : ""}`;
      return `<button class="cycle-card${active}" type="button" data-cycle="luck" data-index="${item.index}"><span>第${item.index}步<br>${item.startYear}-${item.endYear}<br>${item.startAge}-${item.endAge}岁</span>${cycleBadges(isCurrent, isSelected, "当前大运")}<strong>${renderGanZhi(item.ganZhi)}</strong><em>${tenGod(dayStem, item.ganZhi.slice(0, 1))}</em></button>`;
    }).join("");

  document.querySelector("#year-track").innerHTML = Array.from({ length: 101 }, (_, index) => {
    const year = birthYear + index;
    const p = getFlowYearPillar(year);
    const isCurrent = year === baziState.currentLiuNian;
    const isSelected = year === baziState.selectedLiuNian;
    const active = `${isCurrent ? " is-current is-active" : ""}${isSelected ? " is-selected" : ""}`;
    return `<button class="cycle-card${active}" type="button" data-cycle="year" data-year="${year}"><span>${year}</span>${cycleBadges(isCurrent, isSelected, "当前流年")}<strong>${renderGanZhi(p)}</strong><em>${tenGod(dayStem, p.slice(0, 1))}</em></button>`;
  }).join("");

  bindCycleInteractions(chart, currentYear, currentAge, birthYear);
  const selectedYearPillar = getFlowYearPillar(baziState.selectedLiuNian);
  renderFlowMonths(baziState.selectedLiuNian, chart, baziState.selectedDaYun, selectedYearPillar, currentAge, autoRender, false);
  updateCycleStatus();
  if (shouldScroll) scrollSelectedIntoView();
}

function refreshSelectionView(detailType = "month", shouldScroll = true) {
  if (!baziState) return;
  const { chart, currentAge, currentLiuNian, birthYear, calendarType, dateValue, timeValue, birthDate, strength, shenSha, currentDaYun } = baziState;
  updateProfessionalRows(chart, baziState.selectedLiuNian, baziState.selectedDaYun);
  renderMobilePillarCards(chart);
  renderTermTips(chart, shenSha);
  renderCycles(currentAge, currentLiuNian, chart, birthYear, false, shouldScroll);
  renderOverview({ chart, calendarType, dateValue, timeValue, birthDate, currentYear: currentLiuNian, currentAge, currentLuck: currentDaYun, strength, shenSha, state: baziState });

  if (detailType === "luck") {
    renderCycleDetail("luck", baziState.selectedDaYun, chart, baziState.selectedLiuNian, currentAge);
  } else if (detailType === "year") {
    renderCycleDetail("year", { year: baziState.selectedLiuNian, luck: baziState.selectedDaYun }, chart, baziState.selectedLiuNian, baziState.selectedLiuNian - birthYear);
  } else {
    const month = buildFlowMonths(baziState.selectedLiuNian)[baziState.selectedLiuYue];
    renderCycleDetail("month", { ...month, luck: baziState.selectedDaYun, yearPillar: getFlowYearPillar(baziState.selectedLiuNian), year: baziState.selectedLiuNian }, chart, baziState.selectedLiuNian, currentAge);
  }
}

function setElementBars(score) {
  const max = Math.max(...Object.values(score), 1);
  const map = { 木: "wood-bar", 火: "fire-bar", 土: "earth-bar", 金: "metal-bar", 水: "water-bar" };
  Object.entries(map).forEach(([element, id]) => {
    const value = Math.round((score[element] / max) * 82);
    const bar = document.querySelector(`#${id}`);
    const label = bar.previousElementSibling;
    bar.style.setProperty("--value", `${Math.max(value, 18)}%`);
    bar.style.setProperty("--element-color", `var(--element-${elementClass[element]})`);
    label.className = `element-label element-${elementClass[element]}`;
    label.textContent = `${element}：${score[element]}点`;
  });
}

function daysInSolarMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function daysInLunarMonth(year, month, leapMode = "normal") {
  try {
    const lunarMonth = leapMode === "leap" ? -month : month;
    return window.LunarYear?.fromYear(year)?.getMonth(lunarMonth)?.getDayCount?.() || 30;
  } catch {
    return 30;
  }
}

function selectorDateParts() {
  return {
    year: Number(document.querySelector("#birth-year")?.value || 1996),
    month: Number(document.querySelector("#birth-month")?.value || 8),
    day: Number(document.querySelector("#birth-day")?.value || 18)
  };
}

function syncBirthDateFromSelects() {
  const { year, month, day } = selectorDateParts();
  document.querySelector("#birth-date").value = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function updateBirthDayOptions() {
  const calendarType = document.querySelector("#calendar-type").value;
  const { year, month, day } = selectorDateParts();
  const leapMode = document.querySelector("#lunar-leap")?.value || "normal";
  const maxDay = calendarType === "农历" ? daysInLunarMonth(year, month, leapMode) : daysInSolarMonth(year, month);
  const daySelect = document.querySelector("#birth-day");
  const selected = Math.min(day || 1, maxDay);
  daySelect.innerHTML = Array.from({ length: maxDay }, (_, index) => {
    const value = index + 1;
    return `<option value="${value}">${value}日</option>`;
  }).join("");
  daySelect.value = String(selected);
  syncBirthDateFromSelects();
}

function updateLeapMonthOptions() {
  const calendarType = document.querySelector("#calendar-type").value;
  const row = document.querySelector("#lunar-leap-row");
  const select = document.querySelector("#lunar-leap");
  const { year, month } = selectorDateParts();
  document.querySelector("#birth-date-label").textContent = `${calendarType}出生日期`;

  if (calendarType !== "农历") {
    row.hidden = true;
    select.innerHTML = '<option value="normal">普通月</option>';
    select.value = "normal";
    updateBirthDayOptions();
    return 0;
  }

  const leapMonth = window.LunarYear?.fromYear(year)?.getLeapMonth?.() || 0;
  if (!leapMonth || leapMonth !== month) {
    row.hidden = true;
    select.innerHTML = '<option value="normal">普通月</option>';
    select.value = "normal";
    updateBirthDayOptions();
    return leapMonth;
  }

  row.hidden = false;
  const oldValue = select.value || "normal";
  select.innerHTML = `<option value="normal">普通${month}月</option><option value="leap">闰${month}月</option>`;
  select.value = oldValue === "leap" ? "leap" : "normal";
  updateBirthDayOptions();
  return leapMonth;
}

function updateTimeMode() {
  document.querySelector("#time-input-mode").value = "shichen";
  document.querySelector("#birth-time").value = document.querySelector("#birth-shichen").value;
}

function initDateSelectors() {
  const { year, month, day } = parseDateParts(document.querySelector("#birth-date").value);
  const thisYear = new Date().getFullYear();
  const yearSelect = document.querySelector("#birth-year");
  const monthSelect = document.querySelector("#birth-month");
  yearSelect.innerHTML = Array.from({ length: thisYear - 1899 }, (_, index) => {
    const value = 1900 + index;
    return `<option value="${value}">${value}年</option>`;
  }).join("");
  monthSelect.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const value = index + 1;
    return `<option value="${value}">${value}月</option>`;
  }).join("");
  yearSelect.value = String(year);
  monthSelect.value = String(month);
  updateBirthDayOptions();
  document.querySelector("#birth-day").value = String(day);
  syncBirthDateFromSelects();
  updateTimeMode();
  updateLeapMonthOptions();
}

function renderOverview({ chart, calendarType, dateValue, timeValue, birthDate, currentYear, currentAge, currentLuck, strength, shenSha, state = baziState }) {
  const pillars = chart.pillars.join(" ");
  const dayStem = chart.stems[2];
  const viewedLuck = state?.selectedDaYun || currentLuck;
  const viewedYear = state?.selectedLiuNian || currentYear;
  const viewedMonth = buildFlowMonths(viewedYear)[state?.selectedLiuYue ?? mod(new Date().getMonth() - 1, 12)];
  const flowYear = getFlowYearPillar(viewedYear);
  const currentLuckText = currentLuck?.ganZhi || "待定";
  const viewedLuckText = viewedLuck?.ganZhi || "待定";
  const relation = relationSummary(flowYear, chart, viewedLuck?.ganZhi ? [viewedLuck.ganZhi.slice(1, 2)] : []);
  const direction = directionAdvice(chart, strength);
  const viewHint = viewedLuck?.index === currentLuck?.index && viewedYear === currentYear
    ? "当前查看与真实当前一致。"
    : `当前查看：${viewedLuckText}大运、${viewedYear}年${flowYear}；真实当前：${currentLuckText}大运、${currentYear}年${getFlowYearPillar(currentYear)}。`;
  document.querySelector("#summary").innerHTML = `
    <div class="summary-list">
      <div><b>基础排盘摘要</b><br>出生历法：${calendarType}；输入日期：${dateValue}；实际用于排盘：公历 ${formatDate(birthDate)} ${timeValue}。四柱为 ${pillars}，日主为${dayStem}${stemElement[dayStem]}。${viewHint}</div>
      <div><b>日主强弱判断</b><br>${strength.type}。${strength.reasons.slice(0, 3).join(" ")}喜用倾向：${strength.useful}</div>
      <div><b>命局格局简析</b><br>此盘以月令${chart.branches[1]}为季节核心，五行气势先看月令，再看通根、印比帮身与财官食伤的克泄耗。整体不只按数量判断，而是看能量是否流通、日主能否承载。</div>
      <div><b>当前查看的岁运</b><br>查看大运：${viewedLuckText}；查看流年：${flowYear}；查看流月：${viewedMonth.pillar}。流年与命局关系：${relation.branches.slice(0, 2).join(" ")}</div>
      <div><b>神煞和方位参考</b><br>${shenSha.slice(0, 3).join("<br>")}<br>${direction}</div>
    </div>`;
}
function updateReport(event, options = {}) {
  event?.preventDefault?.();
  const shouldScrollToResult = event?.type === "submit" && options.scrollToResult !== false;
  clearSingleReadingState({ clearQuestion: true });

  try {
    updateTimeMode();
    updateLeapMonthOptions();
    syncBirthDateFromSelects();

    const dateValue = document.querySelector("#birth-date").value;
    const timeValue = document.querySelector("#birth-time").value || "23:30";
    const calendarType = document.querySelector("#calendar-type").value;
    const leapMonth = window.LunarYear?.fromYear(selectorDateParts().year)?.getLeapMonth?.() || 0;
    const lunarLeapMode = document.querySelector("#lunar-leap").value;
    const ziDayMode = document.querySelector("#zi-day-mode").value;
    const province = selectedText("#birth-province") || "北京市";
    const city = selectedText("#birth-city") || "北京市";
    const area = selectedText("#birth-area") || "东城区";
    const solarTime = document.querySelector("#solar-time").checked;
    const gender = document.querySelector("#gender").value;
    const birthDate = getBirthDate(dateValue, timeValue, calendarType, lunarLeapMode);
    const today = new Date();
    const ageInfo = getAgeInfo(birthDate, today);
    const currentAge = ageInfo.fullAge;
    const currentYear = today.getFullYear();
    const currentMonthIndex = mod(today.getMonth() - 1, 12);
    const chart = buildAccurateChart(birthDate, gender, ziDayMode);
    chart.daYun.forEach((item) => { item.current = isLuckInYear(item, currentYear); });
    const pillars = chart.pillars;
    const dayStem = chart.stems[2];
    const strength = analyzeStrength(chart);
    const natalRelations = natalRelationSummary(chart);
    const currentLuck = getActiveLuck(chart, currentAge, currentYear);
    const shenSha = getShenSha(chart, [
      currentLuck?.ganZhi ? { label: "大运", pillar: currentLuck.ganZhi } : null,
      { label: "流年", pillar: getFlowYearPillar(currentYear) }
    ].filter(Boolean));

    baziState = {
      chart,
      birthYear: birthDate.getFullYear(),
      currentAge,
      currentDaYun: currentLuck,
      selectedDaYun: currentLuck,
      currentLiuNian: currentYear,
      selectedLiuNian: currentYear,
      currentLiuYue: currentMonthIndex,
      selectedLiuYue: currentMonthIndex,
      calendarType,
      dateValue,
      timeValue,
      birthDate,
      ageInfo,
      strength,
      shenSha
    };

    document.querySelector("#year-pillar").innerHTML = renderGanZhi(pillars[0]);
    document.querySelector("#month-pillar").innerHTML = renderGanZhi(pillars[1]);
    document.querySelector("#day-pillar").innerHTML = renderGanZhi(pillars[2]);
    document.querySelector("#hour-pillar").innerHTML = renderGanZhi(pillars[3]);
    document.querySelector("#report-title").textContent = `${city}专业细盘`;
    document.querySelector("#meta-date").textContent = calendarType === "农历"
      ? `农历${lunarLeapMode === "leap" ? "闰" : ""}${dateValue} · ${selectedText("#birth-shichen")}`
      : `公历 ${dateValue} · ${selectedText("#birth-shichen")}`;
    document.querySelector("#meta-used-solar").textContent = `实际用于排盘：公历 ${formatDate(birthDate)} ${timeValue} · ${ziDayMode === "23" ? "23点换日" : "0点换日"}`;
    document.querySelector("#meta-place").textContent = `${province} ${city} ${area} · 中国标准时间 UTC+8`;
    document.querySelector("#meta-start-luck").textContent = `出生后 ${chart.yun.startYear} 年 ${chart.yun.startMonth} 月 ${chart.yun.startDay} 天 ${chart.yun.startHour} 小时起运，实际起运 ${chart.yun.startSolar}，${chart.yun.forward ? "顺行" : "逆行"}`;
    document.querySelector("#meta-current").textContent = `${currentYear} 年 · 周岁 ${currentAge} 岁（按 ${ageInfo.todayText} 计算，${ageInfo.birthdayStatus}）· 当前流年：${getFlowYearPillar(currentYear)}`;

    setElementBars(countElements(pillars));
    document.querySelector("#relation-title").textContent = `${dayStem}日主，月令${chart.branches[1]}`;
    document.querySelector("#relation-copy").innerHTML = `年柱按立春，月柱按节气月令，日柱按干支日，时柱按日干加时辰。<br>天干：${natalRelations.stems.slice(0, 2).join("；")}<br>地支：${natalRelations.branches.slice(0, 2).join("；")}`;
    document.querySelector("#ten-gods").textContent = chart.tenGods.join(" · ");
    document.querySelector("#shen-sha").textContent = shenSha.slice(0, 4).map((item) => item.split("：")[0]).join(" · ");
    document.querySelector("#strength-title").textContent = `日主强弱：${strength.type}`;
    document.querySelector("#strength-copy").innerHTML = `判断原因：${strength.reasons.slice(0, 4).join(" ")}<br>喜用倾向：${strength.useful}`;
    document.querySelector("#luck-copy").textContent = `当前年份 ${currentYear} 年，当前周岁 ${currentAge} 岁（${ageInfo.birthdayStatus}）。${chart.yun.directionReason}起运按出生时刻到${chart.yun.forward ? "下一个节" : "上一个节"}的时间差折算。`;
    document.querySelector("#place-note").textContent = `出生日期类型：${calendarType}。${calendarType === "农历" ? (leapMonth ? `该农历年闰${leapMonth}月；` : "该农历年无闰月；") : ""}出生地：${province}${city}${area}。子时默认按 23 点换日。${solarTime ? "真太阳时提示已开启，后续可接入经纬度校正。" : "真太阳时提示已关闭，当前按中国标准时间 UTC+8 展示。"}`;

    refreshSelectionView("month", true);
    if (shouldScrollToResult) {
      document.querySelector(".report-panel")?.scrollIntoView?.({ block: "start", behavior: "smooth" });
    }
  } catch (error) {
    document.querySelector("#summary").textContent = "出生信息无法排盘，请检查日期、历法和农历闰月是否选择正确。";
    document.querySelector("#cycle-detail").textContent = error.message || "排盘失败。";
  }
}

document.querySelector("#reset-luck")?.addEventListener("click", () => {
  if (!baziState) return;
  baziState.selectedDaYun = baziState.currentDaYun;
  refreshSelectionView("luck", false);
});

document.querySelector("#reset-year")?.addEventListener("click", () => {
  if (!baziState) return;
  baziState.selectedLiuNian = baziState.currentLiuNian;
  baziState.selectedLiuYue = baziState.currentLiuYue;
  refreshSelectionView("year", false);
});

document.querySelector("#prev-decade")?.addEventListener("click", () => {
  document.querySelector("#year-track")?.scrollBy?.({ left: -1160, behavior: "smooth" });
});

document.querySelector("#next-decade")?.addEventListener("click", () => {
  document.querySelector("#year-track")?.scrollBy?.({ left: 1160, behavior: "smooth" });
});

document.querySelector("#calendar-type").addEventListener("change", () => {
  updateLeapMonthOptions();
  updateReport();
});

document.querySelector("#consult-button").addEventListener("click", () => {
  const question = document.querySelector("#consult-direction").value.trim();
  const result = document.querySelector("#consult-result");
  currentSingleReading = null;
  paidOrderNo = null;
  singleReadingText = "";
  singleReadingQuestion = question;
  if (!question) {
    result.textContent = "请先输入你想咨询的具体方向，例如事业、财运、感情、流年或某个具体问题。";
    return;
  }
  openSinglePayModal({
    title: "生成咨询方向解读",
    description: "本次解读将围绕你输入的具体问题，结合命盘结构、大运流年和五行关系，生成一份专项分析建议。",
    buttonText: "9.99 元立即解读",
    onSuccess: async () => {
      result.textContent = "正在生成专项解读，请稍候...";
      try {
        singleReadingText = await requestSingleReading(question);
        currentSingleReading = {
          question,
          result: singleReadingText,
          createdAt: new Date().toISOString()
        };
        result.textContent = singleReadingText;
      } catch (error) {
        console.warn("single reading failed", error);
        currentSingleReading = null;
        singleReadingText = "";
        result.textContent = "AI 解读生成失败，请稍后再试。";
      }
    }
  });
});

document.querySelector("#payment-modal")?.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-payment]")) {
    closeSinglePayModal();
  }
});

document.querySelector("#confirm-paid-generate")?.addEventListener("click", () => {
  confirmSinglePay().catch((error) => {
    console.warn("payment confirmation failed", error);
    const result = document.querySelector("#consult-result");
    if (result) result.textContent = "AI 解读生成失败，请稍后再试。";
  });
});

document.querySelector("#birth-province").addEventListener("change", () => {
  updateCities();
  updateReport();
});
document.querySelector("#birth-city").addEventListener("change", () => {
  updateAreas();
  updateReport();
});
document.querySelector("#birth-area").addEventListener("change", updateReport);
document.querySelector("#bazi-form").addEventListener("submit", updateReport);
["#gender", "#lunar-leap", "#birth-year", "#birth-month", "#birth-day", "#birth-shichen", "#solar-time"].forEach((selector) => {
  document.querySelector(selector)?.addEventListener("change", () => {
    if (["#birth-year", "#birth-month", "#lunar-leap"].includes(selector)) updateLeapMonthOptions();
    else if (selector === "#birth-day") syncBirthDateFromSelects();
    else if (selector === "#birth-shichen") updateTimeMode();
    updateReport();
  });
});

async function bootstrap() {
  initDateSelectors();
  await loadChinaAreas();
  fillSelect(document.querySelector("#birth-province"), chinaPlaces, (province) => province.name);
  updateCities();
  updateReport();
}

bootstrap();
