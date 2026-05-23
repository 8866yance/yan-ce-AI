const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const stemElement = { 甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土", 己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水" };
const branchElement = { 子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火", 午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水" };
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
const solarTerms = [
  { name: "小寒", index: 0, branch: "丑" },
  { name: "立春", index: 2, branch: "寅" },
  { name: "惊蛰", index: 4, branch: "卯" },
  { name: "清明", index: 6, branch: "辰" },
  { name: "立夏", index: 8, branch: "巳" },
  { name: "芒种", index: 10, branch: "午" },
  { name: "小暑", index: 12, branch: "未" },
  { name: "立秋", index: 14, branch: "申" },
  { name: "白露", index: 16, branch: "酉" },
  { name: "寒露", index: 18, branch: "戌" },
  { name: "立冬", index: 20, branch: "亥" },
  { name: "大雪", index: 22, branch: "子" }
];
const solarTermInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];

const chinaPlaces = {
  北京市: { 北京市: ["东城区", "西城区", "朝阳区", "海淀区", "丰台区", "通州区", "昌平区", "大兴区"] },
  上海市: { 上海市: ["黄浦区", "徐汇区", "静安区", "浦东新区", "闵行区", "宝山区", "松江区", "青浦区"] },
  广东省: {
    广州市: ["越秀区", "天河区", "海珠区", "番禺区", "白云区", "黄埔区"],
    深圳市: ["福田区", "南山区", "罗湖区", "宝安区", "龙岗区", "龙华区"],
    佛山市: ["禅城区", "南海区", "顺德区", "三水区", "高明区"]
  },
  四川省: {
    成都市: ["锦江区", "青羊区", "武侯区", "成华区", "双流区", "郫都区", "都江堰市"],
    绵阳市: ["涪城区", "游仙区", "安州区", "江油市", "三台县"],
    南充市: ["顺庆区", "高坪区", "嘉陵区", "阆中市", "南部县"]
  },
  浙江省: {
    杭州市: ["上城区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区"],
    宁波市: ["海曙区", "江北区", "北仑区", "鄞州区", "慈溪市", "余姚市"]
  },
  江苏省: {
    南京市: ["玄武区", "秦淮区", "建邺区", "鼓楼区", "江宁区", "浦口区"],
    苏州市: ["姑苏区", "虎丘区", "吴中区", "相城区", "昆山市", "张家港市"]
  }
};

function mod(value, length) {
  return ((value % length) + length) % length;
}

function gz(index) {
  return `${stems[mod(index, 10)]}${branches[mod(index, 12)]}`;
}

function splitPillar(value) {
  return { stem: value.slice(0, 1), branch: value.slice(1, 2) };
}

function getBirthDate(dateValue, timeValue) {
  const [hour = "0", minute = "0"] = (timeValue || "00:00").split(":");
  return new Date(`${dateValue || "1996-08-18"}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function calculateAge(birthDate, today = new Date()) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthday = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  return Math.max(hadBirthday ? age : age - 1, 0);
}

function julianDayNumber(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function getSolarTermDate(year, index) {
  const ms = 31556925974.7 * (year - 1900) + solarTermInfo[index] * 60000 + Date.UTC(1900, 0, 6, 2, 5);
  return new Date(ms);
}

function getYearForBazi(date) {
  const lichun = getSolarTermDate(date.getFullYear(), 2);
  return date < lichun ? date.getFullYear() - 1 : date.getFullYear();
}

function getYearPillar(date) {
  return gz(getYearForBazi(date) - 4);
}

function getMonthTerm(date) {
  let current = solarTerms[0];
  for (const term of solarTerms) {
    const boundary = getSolarTermDate(date.getFullYear(), term.index);
    if (date >= boundary) current = term;
  }
  if (date < getSolarTermDate(date.getFullYear(), 0)) current = solarTerms[11];
  return current;
}

function getMonthBoundaries(date) {
  const year = date.getFullYear();
  const boundaries = [
    ...solarTerms.map((term) => ({ ...term, date: getSolarTermDate(year, term.index) })),
    { ...solarTerms[0], date: getSolarTermDate(year + 1, 0) }
  ];
  let previous = { ...solarTerms[11], date: getSolarTermDate(year - 1, 22) };
  let next = boundaries[0];
  for (const boundary of boundaries) {
    if (date >= boundary.date) previous = boundary;
    if (date < boundary.date) {
      next = boundary;
      break;
    }
  }
  return { previous, next };
}

function getMonthPillar(date, yearStem) {
  const term = getMonthTerm(date);
  const monthBranchIndex = branches.indexOf(term.branch);
  const monthOrderFromYin = mod(monthBranchIndex - branches.indexOf("寅"), 12);
  const yearStemIndex = stems.indexOf(yearStem);
  const firstMonthStemIndex = mod((yearStemIndex % 5) * 2 + 2, 10);
  return gz(firstMonthStemIndex + monthOrderFromYin);
}

function getDayPillar(date) {
  const dayDate = date.getHours() >= 23 ? addDays(date, 1) : date;
  const jdn = julianDayNumber(dayDate.getFullYear(), dayDate.getMonth() + 1, dayDate.getDate());
  const jiaZiJdn = julianDayNumber(2000, 1, 7);
  return gz(jdn - jiaZiJdn);
}

function getHourBranch(hour) {
  const index = Math.floor(((hour + 1) % 24) / 2);
  return branches[index];
}

function getHourPillar(date, dayStem) {
  const branch = getHourBranch(date.getHours());
  const branchIndex = branches.indexOf(branch);
  const dayStemIndex = stems.indexOf(dayStem);
  const ziStemIndex = mod((dayStemIndex % 5) * 2, 10);
  return `${stems[mod(ziStemIndex + branchIndex, 10)]}${branch}`;
}

function tenGod(dayStem, targetStem) {
  if (!targetStem) return "";
  const dayIndex = stems.indexOf(dayStem);
  const targetIndex = stems.indexOf(targetStem);
  const dayEl = stemElement[dayStem];
  const targetEl = stemElement[targetStem];
  const samePolarity = dayIndex % 2 === targetIndex % 2;
  const produces = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  const controls = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };

  if (targetEl === dayEl) return samePolarity ? "比肩" : "劫财";
  if (produces[dayEl] === targetEl) return samePolarity ? "食神" : "伤官";
  if (controls[dayEl] === targetEl) return samePolarity ? "偏财" : "正财";
  if (controls[targetEl] === dayEl) return samePolarity ? "七杀" : "正官";
  if (produces[targetEl] === dayEl) return samePolarity ? "偏印" : "正印";
  return "";
}

function hiddenWithGods(branch, dayStem) {
  return (hiddenStems[branch] || []).map((stem) => `${stem}${tenGod(dayStem, stem)}`).join("<br>");
}

function fillSelect(select, values, formatter = (value) => value) {
  select.innerHTML = values.map((value) => `<option value="${value}">${formatter(value)}</option>`).join("");
}

function updateCities() {
  const province = document.querySelector("#birth-province").value;
  const cities = Object.keys(chinaPlaces[province] || {});
  fillSelect(document.querySelector("#birth-city"), cities, (city) => city === "北京市" ? "北京市，默认城市" : city);
  updateAreas();
}

function updateAreas() {
  const province = document.querySelector("#birth-province").value;
  const city = document.querySelector("#birth-city").value;
  fillSelect(document.querySelector("#birth-area"), chinaPlaces[province]?.[city] || []);
}

function calculateChart(date) {
  const yearPillar = getYearPillar(date);
  const yearStem = yearPillar.slice(0, 1);
  const monthPillar = getMonthPillar(date, yearStem);
  const dayPillar = getDayPillar(date);
  const hourPillar = getHourPillar(date, dayPillar.slice(0, 1));
  return [yearPillar, monthPillar, dayPillar, hourPillar];
}

function isYangStem(stem) {
  return stems.indexOf(stem) % 2 === 0;
}

function getLuckDirection(gender, yearStem) {
  const yangYear = isYangStem(yearStem);
  return (gender === "男" && yangYear) || (gender === "女" && !yangYear) ? 1 : -1;
}

function getLuckStart(date, direction) {
  const { previous, next } = getMonthBoundaries(date);
  const target = direction === 1 ? next.date : previous.date;
  const diffMs = Math.abs(target.getTime() - date.getTime());
  const diffDays = diffMs / 86400000;
  const totalMonths = Math.max(1, Math.round(diffDays * 4));
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days: Math.round((diffDays * 4 - totalMonths) * 30),
    startAge: Math.max(1, Math.round(totalMonths / 12)),
    targetTerm: target === next.date ? next.name : previous.name
  };
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

function updateProfessionalRows(pillars, currentYear, dayStem, startLuckAge) {
  const keys = ["flow", "luck", "year", "month", "day", "hour"];
  const flowPillar = gz(currentYear - 4);
  const luckPillar = gz(getYearForBazi(new Date()) + startLuckAge - 4);
  const allPillars = [flowPillar, luckPillar, ...pillars];

  keys.forEach((key, index) => {
    const item = splitPillar(allPillars[index]);
    document.querySelector(`#star-${key}`).textContent = key === "day" ? "日主" : tenGod(dayStem, item.stem);
    document.querySelector(`#stem-${key}`).textContent = item.stem;
    document.querySelector(`#branch-${key}`).textContent = item.branch;
    document.querySelector(`#hidden-${key}`).innerHTML = hiddenWithGods(item.branch, dayStem);
    document.querySelector(`#stage-${key}`).textContent = stages[mod(branches.indexOf(item.branch), stages.length)];
    document.querySelector(`#self-${key}`).textContent = stages[mod(branches.indexOf(item.branch) + 4, stages.length)];
    document.querySelector(`#void-${key}`).textContent = voids[mod(stems.indexOf(item.stem) + branches.indexOf(item.branch), voids.length)];
    document.querySelector(`#nayin-${key}`).textContent = nayins[mod(stems.indexOf(item.stem) * 6 + branches.indexOf(item.branch), nayins.length)];
    document.querySelector(`#sha-${key}`).textContent = shaList[mod(branches.indexOf(item.branch) + index, shaList.length)];
  });
}

function renderCycles(birthYear, currentAge, currentYear, luckInfo, dayStem, monthPillar, direction) {
  document.querySelector("#luck-track").innerHTML = Array.from({ length: 9 }, (_, index) => {
    const age = luckInfo.startAge + index * 10;
    const year = birthYear + age;
    const monthIndex = stems.indexOf(monthPillar.slice(0, 1)) + branches.indexOf(monthPillar.slice(1));
    const p = gz(monthIndex + direction * (index + 1));
    const active = currentAge >= age && currentAge < age + 10 ? " is-active" : "";
    return `<div class="cycle-card${active}"><span>${year}<br>${age}-${age + 9}岁</span><strong>${p}</strong><em>${tenGod(dayStem, p.slice(0, 1))}</em></div>`;
  }).join("");

  document.querySelector("#year-track").innerHTML = Array.from({ length: 10 }, (_, index) => {
    const year = currentYear - 4 + index;
    const p = gz(year - 4);
    const active = year === currentYear ? " is-active" : "";
    return `<div class="cycle-card${active}"><span>${year}</span><strong>${p}</strong><em>${tenGod(dayStem, p.slice(0, 1))}</em></div>`;
  }).join("");

  const months = ["立春 2/4", "惊蛰 3/6", "清明 4/5", "立夏 5/6", "芒种 6/6", "小暑 7/7", "立秋 8/8", "白露 9/8", "寒露 10/8", "立冬 11/7"];
  document.querySelector("#month-track").innerHTML = months.map((month, index) => {
    const p = gz(currentYear + index + stems.indexOf(dayStem));
    return `<div class="cycle-card"><span>${month}</span><strong>${p}</strong><em>${tenGod(dayStem, p.slice(0, 1))}</em></div>`;
  }).join("");
}

function setElementBars(score) {
  const max = Math.max(...Object.values(score), 1);
  const map = { 木: "wood-bar", 火: "fire-bar", 土: "earth-bar", 金: "metal-bar", 水: "water-bar" };
  Object.entries(map).forEach(([element, id]) => {
    const value = Math.round((score[element] / max) * 82);
    document.querySelector(`#${id}`).style.setProperty("--value", `${Math.max(value, 18)}%`);
  });
}

function updateReport(event) {
  event?.preventDefault?.();

  const dateValue = document.querySelector("#birth-date").value;
  const timeValue = document.querySelector("#birth-time").value || "00:00";
  const calendarType = document.querySelector("#calendar-type").value;
  const province = document.querySelector("#birth-province").value || "北京市";
  const city = document.querySelector("#birth-city").value || "北京市";
  const area = document.querySelector("#birth-area").value || "东城区";
  const placeMode = document.querySelector("#birth-place-mode").value;
  const solarTime = document.querySelector("#solar-time").checked;
  const gender = document.querySelector("#gender").value;
  const birthDate = getBirthDate(dateValue, timeValue);
  const today = new Date();
  const currentAge = calculateAge(birthDate, today);
  const currentYear = today.getFullYear();
  const pillars = calculateChart(birthDate);
  const dayStem = pillars[2].slice(0, 1);
  const luckDirection = getLuckDirection(gender, pillars[0].slice(0, 1));
  const luckInfo = getLuckStart(birthDate, luckDirection);

  document.querySelector("#year-pillar").textContent = pillars[0];
  document.querySelector("#month-pillar").textContent = pillars[1];
  document.querySelector("#day-pillar").textContent = pillars[2];
  document.querySelector("#hour-pillar").textContent = pillars[3];
  document.querySelector("#report-title").textContent = `${city}专业细盘`;
  document.querySelector("#meta-date").textContent = `${calendarType} ${dateValue} ${timeValue}`;
  document.querySelector("#meta-place").textContent = `${province} ${city} ${area}`;
  document.querySelector("#meta-start-luck").textContent = `出生后约 ${luckInfo.years} 年 ${luckInfo.months} 月起运，${luckDirection === 1 ? "顺行" : "逆行"}，以${luckInfo.targetTerm}折算`;
  document.querySelector("#meta-current").textContent = `${currentAge} 岁 · 当前流年：${gz(currentYear - 4)}`;

  updateProfessionalRows(pillars, currentYear, dayStem, luckInfo.startAge);
  renderCycles(birthDate.getFullYear(), currentAge, currentYear, luckInfo, dayStem, pillars[1], luckDirection);
  setElementBars(countElements(pillars));

  document.querySelector("#relation-title").textContent = `${branchElement[pillars[2].slice(1)]}日主，月令${getMonthTerm(birthDate).name}`;
  document.querySelector("#relation-copy").textContent = "当前版本按公历日期、节气近似边界和干支纪日计算四柱，后续会升级到精确节气时刻和真太阳时。";
  document.querySelector("#ten-gods").textContent = pillars.map((p, index) => index === 2 ? "日主" : tenGod(dayStem, p.slice(0, 1))).join(" · ");
  document.querySelector("#shen-sha").textContent = pillars.map((p, index) => shaList[mod(branches.indexOf(p.slice(1)) + index, shaList.length)]).join(" · ");
  document.querySelector("#luck-cycle").textContent = `当前大运：${document.querySelector("#luck-track .is-active strong")?.textContent || "待定"}`;
  document.querySelector("#luck-copy").textContent = `当前年龄 ${currentAge} 岁，系统会根据起运年龄匹配对应十年大运，并结合 ${gz(currentYear - 4)} 流年做专项解读。`;
  document.querySelector("#summary").textContent = "当前排盘已由真实日期规则生成，不再使用随机模拟数据。请注意：此版本节气使用近似日期，临近节气交接日或子时边界时仍需精确天文历校正。";
  document.querySelector("#place-note").textContent = `出生历法：${calendarType}。出生地选择：${placeMode === "按出生地" ? `${province}${city}${area}` : "北京默认基准"}。${solarTime ? "已启用真太阳时提示，后续会接入经纬度校正。" : "当前按标准时区生成基础分析。"}`;
}

document.querySelector("#calendar-type").addEventListener("change", (event) => {
  document.querySelector("#birth-date-label").textContent = `${event.target.value}出生日期`;
});

document.querySelector("#consult-button").addEventListener("click", () => {
  const question = document.querySelector("#consult-direction").value.trim();
  const result = document.querySelector("#consult-result");
  result.textContent = question
    ? `咨询方向：${question}。后续接入 AI 后，会基于上方专业细盘、大运流年、神煞和五行结构生成专项解读。`
    : "请先输入你想咨询的具体方向，例如事业、财运、感情、流年或某个具体问题。";
});

fillSelect(document.querySelector("#birth-province"), Object.keys(chinaPlaces), (province) => province === "北京市" ? "北京市，默认省份" : province);
document.querySelector("#birth-province").addEventListener("change", () => {
  updateCities();
  updateReport();
});
document.querySelector("#birth-city").addEventListener("change", () => {
  updateAreas();
  updateReport();
});
updateCities();
document.querySelector("#bazi-form").addEventListener("submit", updateReport);
["#gender", "#calendar-type", "#birth-date", "#birth-time", "#birth-area", "#birth-place-mode", "#solar-time"].forEach((selector) => {
  document.querySelector(selector).addEventListener("change", updateReport);
});
updateReport();
