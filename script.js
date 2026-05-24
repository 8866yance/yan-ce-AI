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
let chinaPlaces = [];
let currentSelection = { luck: null, year: null, month: null };

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
  const label = element ? `<small>${element}</small>` : "";
  return `<span class="gz-char${className}" data-part="${part}" data-element="${element}"><b>${char}</b>${label}</span>`;
}

function renderGanZhi(pillar) {
  if (!pillar) return "";
  const { stem, branch } = splitPillar(pillar);
  return `<span class="gz-pair">${renderGanZhiPart(stem, "stem")}${renderGanZhiPart(branch, "branch")}</span>`;
}

function parseDateParts(dateValue) {
  const [year = "1996", month = "08", day = "18"] = (dateValue || "1996-08-18").split("-");
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day)
  };
}

function getBirthDate(dateValue, timeValue, calendarType = "公历", isLeapMonth = false) {
  const [hour = "0", minute = "0"] = (timeValue || "00:00").split(":");
  const { year, month, day } = parseDateParts(dateValue);
  const h = Number(hour);
  const m = Number(minute);

  if (calendarType === "农历") {
    const lunarMonth = isLeapMonth ? -month : month;
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

function updateCities() {
  const province = selectedNode("#birth-province", chinaPlaces);
  const cities = province.children || [];
  fillSelect(document.querySelector("#birth-city"), cities, (city) => city.name === "市辖区" ? "北京市，默认城市" : city.name);
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
  const stemTexts = chart.stems.flatMap((stem, index) => getStemRelation(target.stem, stem).map((text) => `${text}（对${["年", "月", "日", "时"][index]}干${stem}）`));
  const branchTexts = chart.branches.flatMap((branch, index) => getBranchRelation(target.branch, branch).map((text) => `${text}（对${["年", "月", "日", "时"][index]}支${branch}）`));
  const groups = getGroupRelations([...chart.branches, ...extraBranches, target.branch]);
  return {
    stems: stemTexts.length ? stemTexts : ["天干未形成明显五合或直接生克"],
    branches: [...branchTexts, ...groups].length ? [...branchTexts, ...groups] : ["地支未形成明显刑冲合害破或三合三会"]
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
  const group = branchGroup(dayBranch);
  const positions = [
    ...chart.pillars.map((pillar, index) => ({ label: ["年柱", "月柱", "日柱", "时柱"][index], pillar, branch: pillar.slice(1, 2) })),
    ...contextPillars.map((item) => ({ label: item.label, pillar: item.pillar, branch: item.pillar.slice(1, 2) }))
  ];
  const result = [];
  const add = (name, targetBranches, meaning) => {
    positions.forEach((position) => {
      if (targetBranches.includes(position.branch)) {
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
  add("羊刃", [yangRen[dayStem]], "行动力强但也容易急躁、冲突或身体损伤。");
  add("禄神", [luShen[dayStem]], "资源、职位、收入基础或自我掌控力。");
  chart.xunKong.forEach((value, index) => {
    if (value) result.push(`空亡在${["年柱", "月柱", "日柱", "时柱"][index]}${chart.pillars[index]}：对应事务有虚、迟、反复或需落地验证。`);
  });

  return result.length ? result : ["未见明显常用神煞；神煞只作辅助参考，仍以五行、十神、生克制化为主。"];
}

function briefShenSha(chart, label, pillar) {
  const texts = getShenSha(chart, [{ label, pillar }])
    .filter((text) => text.includes(`在${label}${pillar}`))
    .map((text) => text.split("在")[0]);
  return texts.length ? texts.slice(0, 2).join("、") : "参考";
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
  const pressure = branchRelationsText.some((text) => text.includes("冲") || text.includes("刑") || text.includes("害") || text.includes("破"));
  const support = ["正印", "偏印", "比肩", "劫财"].includes(god);
  const wealth = ["正财", "偏财"].includes(god);
  const career = ["正官", "七杀"].includes(god);
  const output = ["食神", "伤官"].includes(god);

  return {
    overall: pressure ? "整体偏动，机会与压力并存，重要决策要留缓冲。" : support ? "整体偏稳，适合蓄力、学习、修复资源。" : "整体以顺势推进为主，宜看清主线后行动。",
    love: pressure ? "感情、人际容易因节奏不同出现摩擦，少用情绪推动关系。" : wealth ? "情感互动和现实议题变多，适合谈边界与承诺。" : "关系宜稳定沟通，避免只顾事务忽略感受。",
    career: career ? "事业规则、职位、责任感增强，适合争取规范平台。" : output ? "适合表达、作品、方案输出，但注意别和规则硬碰。" : "事业以稳步推进和复盘资源为主。",
    wealth: wealth ? "财务议题被引动，适合规划收入、客户、项目回款。" : pressure ? "财务上避免冲动投入和人情借贷。" : "财务宜守正，先确保现金流稳定。",
    network: support ? "容易得到同辈或长辈支持，但也要防依赖。" : pressure ? "合作中要把责任和期限写清楚。" : "人际以互惠和清晰沟通为佳。",
    health: pressure ? "注意睡眠、肝胆筋骨、交通与运动损伤。" : strengthType.includes("弱") ? "体力消耗后恢复慢，注意规律作息。" : "健康重点是避免过劳和饮食失衡。"
  };
}

function renderDetailHtml(title, sections) {
  return `<strong>${title}</strong>${sections.map((section) => `<br><br><b>${section.label}</b><br>${section.content}`).join("")}`;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatHiddenGan(gans, gods) {
  return gans.map((gan, index) => `${renderGanZhiPart(gan, "hidden")}${gods[index] || ""}`).join("<br>");
}

function buildAccurateChart(date, gender) {
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
  eightChar.setSect(2);
  const yun = eightChar.getYun(gender === "男" ? 1 : 0, 2);

  return {
    solar,
    lunar,
    eightChar,
    pillars: [eightChar.getYear(), eightChar.getMonth(), eightChar.getDay(), eightChar.getTime()],
    stems: [eightChar.getYearGan(), eightChar.getMonthGan(), eightChar.getDayGan(), eightChar.getTimeGan()],
    branches: [eightChar.getYearZhi(), eightChar.getMonthZhi(), eightChar.getDayZhi(), eightChar.getTimeZhi()],
    hiddenGan: [
      eightChar.getYearHideGan(),
      eightChar.getMonthHideGan(),
      eightChar.getDayHideGan(),
      eightChar.getTimeHideGan()
    ],
    hiddenGods: [
      eightChar.getYearShiShenZhi(),
      eightChar.getMonthShiShenZhi(),
      eightChar.getDayShiShenZhi(),
      eightChar.getTimeShiShenZhi()
    ],
    tenGods: [
      eightChar.getYearShiShenGan(),
      eightChar.getMonthShiShenGan(),
      eightChar.getDayShiShenGan(),
      eightChar.getTimeShiShenGan()
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
      eightChar.getTimeXunKong()
    ],
    nayin: [
      eightChar.getYearNaYin(),
      eightChar.getMonthNaYin(),
      eightChar.getDayNaYin(),
      eightChar.getTimeNaYin()
    ],
    yun: {
      forward: yun.isForward(),
      startYear: yun.getStartYear(),
      startMonth: yun.getStartMonth(),
      startDay: yun.getStartDay(),
      startHour: yun.getStartHour(),
      startSolar: yun.getStartSolar().toYmdHms()
    },
    daYun: yun.getDaYun(10).map((item) => ({
      index: item.getIndex(),
      ganZhi: item.getGanZhi(),
      startYear: item.getStartYear(),
      endYear: item.getEndYear(),
      startAge: item.getStartAge(),
      endAge: item.getEndAge(),
      xunKong: item.getGanZhi() ? item.getXunKong() : ""
    }))
  };
}

function updateProfessionalRows(chart, currentYear, currentAge) {
  const keys = ["flow", "luck", "year", "month", "day", "hour"];
  const dayStem = chart.stems[2];
  const flowPillar = getFlowYearPillar(currentYear);
  const activeLuck = chart.daYun.find((item) => item.index > 0 && currentAge >= item.startAge && currentAge <= item.endAge)
    || chart.daYun.find((item) => item.index > 0)
    || { ganZhi: "" };
  const luckPillar = activeLuck.ganZhi || flowPillar;
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
    document.querySelector(`#void-${key}`).textContent = index >= 2 ? chart.xunKong[index - 2] : (key === "luck" ? activeLuck.xunKong : "");
    document.querySelector(`#nayin-${key}`).textContent = index >= 2 ? chart.nayin[index - 2] : getNaYinForPillar(allPillars[index]);
    document.querySelector(`#sha-${key}`).textContent = index >= 2
      ? briefShenSha(chart, ["年柱", "月柱", "日柱", "时柱"][index - 2], allPillars[index])
      : briefShenSha(chart, key === "flow" ? "流年" : "大运", allPillars[index]);
  });
}

function getActiveLuck(chart, currentAge) {
  return chart.daYun.find((item) => item.index > 0 && currentAge >= item.startAge && currentAge <= item.endAge)
    || chart.daYun.find((item) => item.index > 0);
}

function renderCycleDetail(type, data, chart, currentYear, currentAge) {
  const detail = document.querySelector("#cycle-detail");
  const dayStem = chart.stems[2];
  const strength = analyzeStrength(chart);

  if (type === "luck") {
    const decadeYears = `${data.startYear}-${data.endYear}`;
    const god = tenGod(dayStem, data.ganZhi.slice(0, 1));
    const relations = relationSummary(data.ganZhi, chart);
    const advice = makeAdvice(god, relations.branches, strength.type);
    const sha = getShenSha(chart, [{ label: "大运", pillar: data.ganZhi }]).slice(0, 5).join("<br>");
    detail.innerHTML = renderDetailHtml(`已选大运：${renderGanZhi(data.ganZhi)}（${decadeYears}，${data.startAge}-${data.endAge}岁）`, [
      { label: "十神与作用", content: `大运天干对日主为${god}，${god}代表${godMeaning(god)}。${strength.type.includes("弱") ? "日主偏弱时先看是否能帮扶日主。" : "日主不弱时更重视能否形成流通和制化。"}` },
      { label: "天干生克", content: relations.stems.join("<br>") },
      { label: "地支刑冲合害破", content: relations.branches.join("<br>") },
      { label: "神煞参考", content: `${sha}<br>神煞只作参考，不作为唯一判断。` },
      { label: "五类提示", content: `事业：${advice.career}<br>财运：${advice.wealth}<br>感情：${advice.love}<br>人际：${advice.network}<br>健康：${advice.health}<br>整体：${advice.overall}` }
    ]);
    document.querySelector("#luck-cycle").innerHTML = `已选大运：${renderGanZhi(data.ganZhi)}`;
    return;
  }

  if (type === "year") {
    const pillar = getFlowYearPillar(data.year);
    const activeLuck = data.luck || getActiveLuck(chart, currentAge || 0);
    const god = tenGod(dayStem, pillar.slice(0, 1));
    const relations = relationSummary(pillar, chart, activeLuck?.ganZhi ? [activeLuck.ganZhi.slice(1, 2)] : []);
    const advice = makeAdvice(god, relations.branches, strength.type);
    const sha = getShenSha(chart, [
      activeLuck?.ganZhi ? { label: "大运", pillar: activeLuck.ganZhi } : null,
      { label: "流年", pillar }
    ].filter(Boolean)).slice(0, 6).join("<br>");
    const riskyMonths = buildFlowMonths(data.year).filter((month) => relationSummary(month.pillar, chart, [pillar.slice(1, 2)]).branches.some((text) => /冲|刑|害|破/.test(text))).slice(0, 3).map((month) => `${month.label}${month.pillar}`).join("、") || "未见特别强的冲刑害破月份";
    detail.innerHTML = renderDetailHtml(`已选流年：${data.year}年 ${renderGanZhi(pillar)}`, [
      { label: "十神与大运", content: `流年天干对日主为${god}，当前大运为${activeLuck?.ganZhi || "待定"}。流年与大运、原局共同决定这一年的主题。` },
      { label: "天干生克", content: relations.stems.join("<br>") },
      { label: "地支刑冲合害破", content: relations.branches.join("<br>") },
      { label: "神煞参考", content: `${sha}<br>神煞只作参考，仍以命局和岁运作用为主。` },
      { label: "需要注意的月份", content: riskyMonths },
      { label: "五类提示", content: `事业：${advice.career}<br>财运：${advice.wealth}<br>感情：${advice.love}<br>人际：${advice.network}<br>健康：${advice.health}<br>整体评分：${scoreTrend(relations, god, strength.type)}。${advice.overall}` }
    ]);
    document.querySelector("#luck-cycle").innerHTML = `已选流年：${data.year}年 ${renderGanZhi(pillar)}`;
    renderFlowMonths(data.year, chart, activeLuck, pillar, currentAge, false);
    return;
  }

  if (type === "month") {
    const activeLuck = data.luck || getActiveLuck(chart, currentAge || 0);
    const yearPillar = data.yearPillar || getFlowYearPillar(data.year);
    const god = tenGod(dayStem, data.pillar.slice(0, 1));
    const relations = relationSummary(data.pillar, chart, [activeLuck?.ganZhi?.slice(1, 2), yearPillar.slice(1, 2)].filter(Boolean));
    const advice = makeAdvice(god, relations.branches, strength.type);
    const sha = getShenSha(chart, [
      activeLuck?.ganZhi ? { label: "大运", pillar: activeLuck.ganZhi } : null,
      { label: "流年", pillar: yearPillar },
      { label: "流月", pillar: data.pillar }
    ].filter(Boolean)).slice(0, 7).join("<br>");
    detail.innerHTML = renderDetailHtml(`已选流月：${data.label} ${renderGanZhi(data.pillar)}`, [
      { label: "流月干支与十神", content: `流月天干对日主为${god}，${god}代表${godMeaning(god)}。` },
      { label: "流月天干与命局天干", content: relations.stems.join("<br>") },
      { label: "流月地支与命局/大运/流年", content: relations.branches.join("<br>") },
      { label: "大运流年流月作用", content: `当前大运${activeLuck?.ganZhi || "待定"}，流年${yearPillar}，流月${data.pillar}。月令短期触发流年主题，若见冲刑害破则事件感更强，若见合会则资源更容易聚合。` },
      { label: "神煞参考", content: `${sha}<br>神煞只作参考，不单独断吉凶。` },
      { label: "五类提示", content: `事业：${advice.career}<br>财运：${advice.wealth}<br>感情：${advice.love}<br>人际：${advice.network}<br>健康：${advice.health}<br>整体运势：${advice.overall}` }
    ]);
    document.querySelector("#luck-cycle").innerHTML = `已选流月：${renderGanZhi(data.pillar)}`;
  }
}

function godMeaning(god) {
  return {
    比肩: "自我、同辈、竞争与坚持",
    劫财: "行动、争夺、合伙与财务分流",
    食神: "表达、口福、创作与稳定输出",
    伤官: "突破、表达、反规则与技术才华",
    偏财: "机会型财富、客户、资源流动",
    正财: "稳定收入、现实责任、经营管理",
    七杀: "压力、挑战、执行力和风险",
    正官: "规则、职位、名誉和约束",
    偏印: "灵感、偏门知识、保护与不稳定资源",
    正印: "学习、贵人、证书和稳定支持",
    日主: "命主自身"
  }[god] || "对应事务";
}

function scoreTrend(relations, god, strengthType) {
  let score = 70;
  score -= relations.branches.filter((text) => /冲|刑|害|破/.test(text)).length * 8;
  score += relations.branches.filter((text) => /合|会/.test(text)).length * 5;
  if (strengthType.includes("弱") && ["正印", "偏印", "比肩", "劫财"].includes(god)) score += 8;
  if (strengthType.includes("强") && ["正官", "七杀", "正财", "偏财", "食神", "伤官"].includes(god)) score += 8;
  if (["七杀", "伤官", "劫财"].includes(god)) score -= 3;
  const bounded = Math.max(35, Math.min(92, score));
  return bounded >= 78 ? `${bounded}分，偏助力` : bounded >= 60 ? `${bounded}分，平中有动` : `${bounded}分，偏压力`;
}

function setSelectedCycle(container, card) {
  container.querySelectorAll(".cycle-card").forEach((item) => item.classList.remove("is-selected"));
  card.classList.add("is-selected");
}

function renderFlowMonths(year, chart, activeLuck, yearPillar, currentAge, autoRender = true) {
  const dayStem = chart.stems[2];
  const monthTrack = document.querySelector("#month-track");
  const months = buildFlowMonths(year);
  const now = new Date();
  const defaultIndex = year === now.getFullYear() ? mod(now.getMonth() - 1, 12) : 0;

  monthTrack.innerHTML = months.map((month, index) => {
    const selected = index === defaultIndex ? " is-selected" : "";
    return `<button class="cycle-card${selected}" type="button" data-cycle="month" data-year="${year}" data-month="${index}"><span>${month.label}</span><strong>${renderGanZhi(month.pillar)}</strong><em>${tenGod(dayStem, month.stem)}</em></button>`;
  }).join("");

  monthTrack.querySelectorAll("[data-cycle='month']").forEach((card) => {
    card.addEventListener("click", () => {
      setSelectedCycle(monthTrack, card);
      const month = months[Number(card.dataset.month)];
      renderCycleDetail("month", { ...month, luck: activeLuck, yearPillar }, chart, year, currentAge);
    });
  });

  if (autoRender) {
    renderCycleDetail("month", { ...months[defaultIndex], luck: activeLuck, yearPillar }, chart, year, currentAge);
  }
}

function bindCycleInteractions(chart, currentYear, currentAge) {
  const luckTrack = document.querySelector("#luck-track");
  const yearTrack = document.querySelector("#year-track");

  luckTrack.querySelectorAll("[data-cycle='luck']").forEach((card) => {
    card.addEventListener("click", () => {
      setSelectedCycle(luckTrack, card);
      const item = chart.daYun.find((luck) => String(luck.index) === card.dataset.index);
      if (item) renderCycleDetail("luck", item, chart, currentYear, currentAge);
    });
  });

  yearTrack.querySelectorAll("[data-cycle='year']").forEach((card) => {
    card.addEventListener("click", () => {
      setSelectedCycle(yearTrack, card);
      renderCycleDetail("year", { year: Number(card.dataset.year), luck: getActiveLuck(chart, currentAge) }, chart, currentYear, currentAge);
    });
  });
}

function renderCycles(currentAge, currentYear, chart) {
  const dayStem = chart.stems[2];
  document.querySelector("#luck-track").innerHTML = chart.daYun.filter((item) => item.index > 0).slice(0, 9).map((item) => {
    const active = currentAge >= item.startAge && currentAge <= item.endAge ? " is-active is-selected" : "";
    return `<button class="cycle-card${active}" type="button" data-cycle="luck" data-index="${item.index}"><span>${item.startYear}<br>${item.startAge}-${item.endAge}岁</span><strong>${renderGanZhi(item.ganZhi)}</strong><em>${tenGod(dayStem, item.ganZhi.slice(0, 1))}</em></button>`;
  }).join("");

  document.querySelector("#year-track").innerHTML = Array.from({ length: 10 }, (_, index) => {
    const year = currentYear - 4 + index;
    const p = getFlowYearPillar(year);
    const active = year === currentYear ? " is-active is-selected" : "";
    return `<button class="cycle-card${active}" type="button" data-cycle="year" data-year="${year}"><span>${year}</span><strong>${renderGanZhi(p)}</strong><em>${tenGod(dayStem, p.slice(0, 1))}</em></button>`;
  }).join("");

  bindCycleInteractions(chart, currentYear, currentAge);
  renderFlowMonths(currentYear, chart, getActiveLuck(chart, currentAge), getFlowYearPillar(currentYear), currentAge);
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

function updateReport(event) {
  event?.preventDefault?.();

  try {
    const dateValue = document.querySelector("#birth-date").value;
    const timeValue = document.querySelector("#birth-time").value || "00:00";
    const calendarType = document.querySelector("#calendar-type").value;
    const isLeapMonth = document.querySelector("#lunar-leap").checked;
    const province = selectedText("#birth-province") || "北京市";
    const city = selectedText("#birth-city") || "北京市";
    const area = selectedText("#birth-area") || "东城区";
    const placeMode = document.querySelector("#birth-place-mode").value;
    const solarTime = document.querySelector("#solar-time").checked;
    const gender = document.querySelector("#gender").value;
    const birthDate = getBirthDate(dateValue, timeValue, calendarType, isLeapMonth);
    const today = new Date();
    const currentAge = calculateAge(birthDate, today);
    const currentYear = today.getFullYear();
    const chart = buildAccurateChart(birthDate, gender);
    const pillars = chart.pillars;
    const dayStem = chart.stems[2];
    const strength = analyzeStrength(chart);
    const natalRelations = natalRelationSummary(chart);
    const shenSha = getShenSha(chart);

    document.querySelector("#year-pillar").innerHTML = renderGanZhi(pillars[0]);
    document.querySelector("#month-pillar").innerHTML = renderGanZhi(pillars[1]);
    document.querySelector("#day-pillar").innerHTML = renderGanZhi(pillars[2]);
    document.querySelector("#hour-pillar").innerHTML = renderGanZhi(pillars[3]);
    document.querySelector("#report-title").textContent = `${city}专业细盘`;
    document.querySelector("#meta-date").textContent = calendarType === "农历"
      ? `农历${isLeapMonth ? "闰" : ""} ${dateValue} ${timeValue} · 折合公历 ${formatDate(birthDate)}`
      : `公历 ${dateValue} ${timeValue}`;
    document.querySelector("#meta-place").textContent = `${province} ${city} ${area} · 中国标准时间 UTC+8`;
    document.querySelector("#meta-start-luck").textContent = `出生后 ${chart.yun.startYear} 年 ${chart.yun.startMonth} 月 ${chart.yun.startDay} 天 ${chart.yun.startHour} 小时起运，${chart.yun.forward ? "顺行" : "逆行"}`;
    document.querySelector("#meta-current").textContent = `${currentYear} 年 · ${currentAge} 岁 · 当前流年：${getFlowYearPillar(currentYear)}`;

    updateProfessionalRows(chart, currentYear, currentAge);
    renderCycles(currentAge, currentYear, chart);
    setElementBars(countElements(pillars));

    document.querySelector("#relation-title").textContent = `${dayStem}日主，月令${chart.branches[1]}`;
    document.querySelector("#relation-copy").innerHTML = `算法：年柱按立春，月柱按节气月令，日柱按干支日，时柱按日干加时辰。<br>天干：${natalRelations.stems.slice(0, 3).join("；")}<br>地支：${natalRelations.branches.slice(0, 3).join("；")}`;
    document.querySelector("#ten-gods").textContent = chart.tenGods.join(" · ");
    document.querySelector("#shen-sha").textContent = shenSha.slice(0, 4).map((item) => item.split("：")[0]).join(" · ");
    document.querySelector("#strength-title").textContent = `日主强弱：${strength.type}`;
    document.querySelector("#strength-copy").innerHTML = `判断原因：${strength.reasons.join(" ")}<br>喜用倾向：${strength.useful}`;
    document.querySelector("#luck-cycle").textContent = `当前大运：${document.querySelector("#luck-track .is-active strong")?.textContent || "待定"}`;
    document.querySelector("#luck-copy").textContent = `当前年份 ${currentYear} 年，当前年龄 ${currentAge} 岁，系统按${chart.yun.forward ? "顺行" : "逆行"}排运，结合 ${getFlowYearPillar(currentYear)} 流年做专项解读。`;
    document.querySelector("#summary").textContent = `当前排盘已接入成熟历法库，不再使用随机模拟数据或手写近似节气表。日主为${dayStem}${stemElement[dayStem]}，强弱判断为${strength.type}。`;
    document.querySelector("#place-note").textContent = `出生日期类型：${calendarType}。出生地选择：${placeMode === "按出生地" ? `${province}${city}${area}` : "北京默认基准"}。${solarTime ? "已启用真太阳时提示，后续会接入经纬度校正。" : "当前按中国标准时间 UTC+8 生成基础分析。"}`;
  } catch (error) {
    document.querySelector("#summary").textContent = "出生信息无法排盘，请检查日期、时间、农历闰月是否填写正确。";
    document.querySelector("#cycle-detail").textContent = error.message || "排盘失败。";
  }
}

document.querySelector("#calendar-type").addEventListener("change", (event) => {
  document.querySelector("#birth-date-label").textContent = `${event.target.value}出生日期`;
  document.querySelector("#lunar-leap-row").hidden = event.target.value !== "农历";
});

document.querySelector("#consult-button").addEventListener("click", () => {
  const question = document.querySelector("#consult-direction").value.trim();
  const result = document.querySelector("#consult-result");
  result.textContent = question
    ? `咨询方向：${question}。后续接入 AI 后，会基于上方专业细盘、大运流年、神煞和五行结构生成专项解读。`
    : "请先输入你想咨询的具体方向，例如事业、财运、感情、流年或某个具体问题。";
});

document.querySelector("#birth-province").addEventListener("change", () => {
  updateCities();
  updateReport();
});
document.querySelector("#birth-city").addEventListener("change", () => {
  updateAreas();
  updateReport();
});
document.querySelector("#birth-area").addEventListener("change", () => {
  updateReport();
});
document.querySelector("#bazi-form").addEventListener("submit", updateReport);
["#gender", "#calendar-type", "#lunar-leap", "#birth-date", "#birth-time", "#birth-place-mode", "#solar-time"].forEach((selector) => {
  document.querySelector(selector).addEventListener("change", updateReport);
});

async function bootstrap() {
  await loadChinaAreas();
  fillSelect(document.querySelector("#birth-province"), chinaPlaces, (province) => province.name === "北京市" ? "北京市，默认省份" : province.name);
  updateCities();
  updateReport();
}

bootstrap();
