const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const tenGodList = ["比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印"];
const stages = ["长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养"];
const voids = ["戌亥", "申酉", "午未", "辰巳", "寅卯", "子丑"];
const nayins = ["海中金", "炉中火", "大林木", "路旁土", "剑锋金", "山头火", "涧下水", "城头土", "白蜡金", "杨柳木", "泉中水", "屋上土", "霹雳火", "松柏木", "长流水", "沙中金", "山下火", "平地木"];
const shaList = ["天乙贵人", "文昌贵人", "国印贵人", "太极贵人", "德秀贵人", "驿马", "华盖", "桃花", "将星", "禄神", "红鸾", "天厨贵人"];
const hiddenStems = {
  子: "癸",
  丑: "己癸辛",
  寅: "甲丙戊",
  卯: "乙",
  辰: "戊乙癸",
  巳: "丙庚戊",
  午: "丁己",
  未: "己丁乙",
  申: "庚壬戊",
  酉: "辛",
  戌: "戊辛丁",
  亥: "壬甲"
};

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

function pillar(seed) {
  return `${stems[mod(seed, stems.length)]}${branches[mod(seed, branches.length)]}`;
}

function splitPillar(value) {
  return { stem: value.slice(0, 1), branch: value.slice(1, 2) };
}

function pick(list, seed) {
  return list[mod(seed, list.length)];
}

function hiddenWithGods(branch, seed) {
  return (hiddenStems[branch] || "")
    .split("")
    .map((stem, index) => `${stem}${pick(tenGodList, seed + index)}`)
    .join("<br>");
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

function getBirthDate(dateValue) {
  if (!dateValue) return new Date("1996-08-18T00:00:00");
  return new Date(`${dateValue}T00:00:00`);
}

function calculateAge(birthDate, today = new Date()) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasHadBirthday) age -= 1;
  return Math.max(age, 0);
}

function updateProfessionalRows(seed, pillars) {
  const keys = ["flow", "luck", "year", "month", "day", "hour"];
  const allPillars = [pillar(seed + 61), pillar(seed + 49), ...pillars];

  keys.forEach((key, index) => {
    const item = splitPillar(allPillars[index]);
    document.querySelector(`#star-${key}`).textContent = index === 4 ? "元男" : pick(tenGodList, seed + index);
    document.querySelector(`#stem-${key}`).textContent = item.stem;
    document.querySelector(`#branch-${key}`).textContent = item.branch;
    document.querySelector(`#hidden-${key}`).innerHTML = hiddenWithGods(item.branch, seed + index);
    document.querySelector(`#stage-${key}`).textContent = pick(stages, seed + index);
    document.querySelector(`#self-${key}`).textContent = pick(stages, seed + index + 4);
    document.querySelector(`#void-${key}`).textContent = pick(voids, seed + index);
    document.querySelector(`#nayin-${key}`).textContent = pick(nayins, seed + index);
    document.querySelector(`#sha-${key}`).textContent = pick(shaList, seed + index);
  });
}

function renderCycles(seed, birthYear, currentAge, currentYear, startLuckAge) {
  const luckTrack = document.querySelector("#luck-track");
  const yearTrack = document.querySelector("#year-track");
  const monthTrack = document.querySelector("#month-track");

  luckTrack.innerHTML = Array.from({ length: 9 }, (_, index) => {
    const age = startLuckAge + index * 10;
    const year = birthYear + age;
    const active = currentAge >= age && currentAge < age + 10 ? " is-active" : "";
    return `<div class="cycle-card${active}"><span>${year}<br>${age}-${age + 9}岁</span><strong>${pillar(seed + index * 7)}</strong><em>${pick(tenGodList, seed + index)}</em></div>`;
  }).join("");

  yearTrack.innerHTML = Array.from({ length: 10 }, (_, index) => {
    const year = currentYear - 4 + index;
    const active = year === currentYear ? " is-active" : "";
    return `<div class="cycle-card${active}"><span>${year}</span><strong>${pillar(seed + index * 5)}</strong><em>${pick(tenGodList, seed + index + 3)}</em></div>`;
  }).join("");

  const months = ["立春 2/4", "惊蛰 3/5", "清明 4/5", "立夏 5/5", "芒种 6/5", "小暑 7/7", "立秋 8/7", "白露 9/7", "寒露 10/8", "立冬 11/7"];
  monthTrack.innerHTML = months.map((month, index) => (
    `<div class="cycle-card"><span>${month}</span><strong>${pillar(seed + index * 3)}</strong><em>${pick(tenGodList, seed + index + 6)}</em></div>`
  )).join("");
}

function updateReport(event) {
  event?.preventDefault?.();

  const date = document.querySelector("#birth-date").value;
  const time = document.querySelector("#birth-time").value || "未知";
  const calendarType = document.querySelector("#calendar-type").value;
  const province = document.querySelector("#birth-province").value || "北京市";
  const city = document.querySelector("#birth-city").value || "北京市";
  const area = document.querySelector("#birth-area").value || "东城区";
  const placeMode = document.querySelector("#birth-place-mode").value;
  const solarTime = document.querySelector("#solar-time").checked;
  const birthDate = getBirthDate(date);
  const today = new Date();
  const currentAge = calculateAge(birthDate, today);
  const currentYear = today.getFullYear();
  const seed = (Number(date.replaceAll("-", "")) || 19960818) + (Number(time.replace(":", "")) || 0) + city.length * 17 + area.length * 11;
  const startLuckAge = mod(seed, 8) + 2;

  const yearPillar = pillar(seed);
  const monthPillar = pillar(seed + 11);
  const dayPillar = pillar(seed + 23);
  const hourPillar = time === "未知" ? "待定" : pillar(seed + 37);
  const pillarValues = [yearPillar, monthPillar, dayPillar, hourPillar];

  document.querySelector("#year-pillar").textContent = yearPillar;
  document.querySelector("#month-pillar").textContent = monthPillar;
  document.querySelector("#day-pillar").textContent = dayPillar;
  document.querySelector("#hour-pillar").textContent = hourPillar;
  document.querySelector("#report-title").textContent = `${city}专业细盘`;
  document.querySelector("#meta-date").textContent = `${calendarType} ${date} ${time}`;
  document.querySelector("#meta-place").textContent = `${province} ${city} ${area}`;
  document.querySelector("#meta-start-luck").textContent = `出生后 ${startLuckAge} 年 ${mod(seed, 10) + 1} 月 ${mod(seed, 27) + 1} 天起运`;
  document.querySelector("#meta-current").textContent = `${currentAge} 岁 · 司令：${pick(stems, seed + 8)}`;

  updateProfessionalRows(seed, pillarValues);
  renderCycles(seed, birthDate.getFullYear(), currentAge, currentYear, startLuckAge);

  document.querySelector("#wood-bar").style.setProperty("--value", `${35 + mod(seed, 42)}%`);
  document.querySelector("#fire-bar").style.setProperty("--value", `${35 + mod(seed + 9, 42)}%`);
  document.querySelector("#earth-bar").style.setProperty("--value", `${28 + mod(seed + 18, 42)}%`);
  document.querySelector("#metal-bar").style.setProperty("--value", `${30 + mod(seed + 27, 42)}%`);
  document.querySelector("#water-bar").style.setProperty("--value", `${36 + mod(seed + 36, 42)}%`);

  document.querySelector("#relation-title").textContent = `${pick(["木火通明", "水火既济", "土金相生", "金木交战"], seed)}，${pick(["印星有力", "财官可用", "食伤透出", "比劫并见"], seed + 3)}`;
  document.querySelector("#relation-copy").textContent = "系统会继续展开天干五合、地支六合三合、冲刑害破与五行流通，帮助用户理解盘面结构。";
  document.querySelector("#ten-gods").textContent = `${pick(tenGodList, seed)} · ${pick(tenGodList, seed + 2)} · ${pick(tenGodList, seed + 4)}`;
  document.querySelector("#shen-sha").textContent = `${pick(shaList, seed)} · ${pick(shaList, seed + 4)} · ${pick(shaList, seed + 8)}`;
  document.querySelector("#luck-cycle").textContent = `当前大运：${pillar(seed + 49)}`;
  document.querySelector("#luck-copy").textContent = `当前大运 ${pillar(seed + 49)} 与流年 ${pillar(seed + 61)} 叠加，后续 AI 会分析阶段主题、机会窗口与风险点。`;
  document.querySelector("#summary").textContent = "这是一份专业细盘预览，已经加入参考图里的主星、天干、地支、藏干、星运、自坐、空亡、纳音、神煞、大运、流年和流月。正式版会把这些结构化数据交给 AI 做详细解读。";
  document.querySelector("#place-note").textContent = `出生历法：${calendarType}。出生地选择：${placeMode === "按出生地" ? `${province}${city}${area}` : "北京默认基准"}。${solarTime ? "已启用真太阳时提示，临界时辰会建议精确到经纬度。" : "当前按标准时区生成基础分析。"}`;
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
document.querySelector("#birth-province").addEventListener("change", updateCities);
document.querySelector("#birth-city").addEventListener("change", updateAreas);
updateCities();
document.querySelector("#bazi-form").addEventListener("submit", updateReport);
["#gender", "#calendar-type", "#birth-date", "#birth-time", "#birth-province", "#birth-city", "#birth-area", "#birth-place-mode", "#solar-time"].forEach((selector) => {
  document.querySelector(selector).addEventListener("change", () => updateReport());
});
document.querySelector("#bazi-form").dispatchEvent(new Event("submit", { cancelable: true }));
