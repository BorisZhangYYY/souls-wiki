/* 余烬法典 — 世界观辞典 / 跨作品母题 / 资料说明 */
const LORE = [
  { id: "first-flame", works: ["ds1", "ds2", "ds3"], name: "初始之火", en: "First Flame", cat: "黑暗之魂", text: "某日在灰雾与古树之间燃起的第一团火。它带来了光与暗、生与死、冷与热——也带来了「差异」与由此而生的欲望。四位在火旁取得王魂者击败不朽古龙，开启火之时代；而火会衰微，此后一切历史都围绕「要不要让它继续烧下去」展开。" },
  { id: "linking-fire", works: ["ds1", "ds2", "ds3"], name: "传火", en: "Linking the Fire", cat: "黑暗之魂", text: "把拥有足够强大灵魂者当作柴薪投入初始之火，以延续火之时代的仪式。葛温是最早的薪王，此后历代英雄前赴后继。黑魂 2 的安第尔指出：强行延长本该结束的时代，正是「原罪」；黑魂 3 的「薪王们的化身」则让所有传火者以同一个躯壳再度起身。" },
  { id: "dark-soul", works: ["ds1", "ds2", "ds3"], name: "黑暗之魂与人性", en: "Dark Soul / Humanity", cat: "黑暗之魂", text: "初始之火旁第四份王魂，被「被遗忘的矮人」取得，成为人类的先祖。人性既是力量，也是深渊的种子；黑暗大蛇卡斯宣称诸神惧怕它，才以传火与「火之封印」约束人类。环印城最终把这条线索推到台前。" },
  { id: "abyss", works: ["ds1", "ds2", "ds3"], name: "深渊", en: "The Abyss", cat: "黑暗之魂", text: "人性失控、膨胀、外溢而成的黑暗领域。乌拉席露的马努斯是其在初代的具体化，其碎片在黑魂 2 化为娜珊德拉、艾蕾娜、娜德拉、阿尔珊娜；黑魂 3 的法兰不死队以「狼血」继承封印之责，最终仍被从内部侵蚀。" },
  { id: "undead-curse", works: ["ds1", "ds2", "ds3"], name: "不死人诅咒与游魂化", en: "Undead Curse / Hollowing", cat: "黑暗之魂", text: "身负黑暗之环者死而复生，却会随死亡与绝望一点点失去人性与记忆，终至成为无意识的「游魂」。黑魂 2 把「遗忘自我」设为主轴，黑魂 3 的「黑暗之环」与隆道尔路线则把游魂化重新诠释为一种身份。" },
  { id: "bonfire", works: ["ds1", "ds2", "ds3"], name: "篝火与防火女", en: "Bonfire / Fire Keeper", cat: "黑暗之魂", text: "以不死人骸骨与火焰维系的检查点，休息可回复原素瓶，却也会让世界重新充满敌人。防火女守护篝火、以灵魂强化原素瓶，其代价是不断承接人性污秽。它是整个系列最温柔、也最残酷的一处设计。" },
  { id: "lord-souls", works: ["ds1", "ds3"], name: "王魂与诸神", en: "Lord Souls", cat: "黑暗之魂", text: "葛温（光）、尼托（死）、伊札里斯魔女（生命）与矮人（黑暗）自初始之火取得的四份原初力量。前三者的后代与封地构成罗德兰的权力版图；到了黑魂 3，昔日神都已凋零，只余「柴薪」被摆回王座。" },
  { id: "ancient-dragons", works: ["ds1", "ds2", "ds3", "er", "sekiro"], name: "古龙与不朽", en: "Ancient Dragons", cat: "跨作品", text: "火之前的世界由不朽古龙与灰雾古树主宰，龙鳞使其近乎超越生死。希斯因无鳞而背叛，喀拉弥特、米狄尔、辛、樱龙、贝勒……几乎每部作品都会留下一条龙，用以标记「比现有秩序更古老的东西」。" },
  { id: "painted-world", works: ["ds1", "ds3"], name: "绘画世界", en: "Painted World", cat: "黑暗之魂", text: "由神所造、用来收容现实所不容者的封闭世界。初代的艾雷米雅斯绘画世界在黑魂 3 以「艾雷德尔」之名重现；少女画师等待染料，盖尔赴世界尽头取黑暗灵魂之血——三部曲最终把「谁来描绘下一个世界」交还给了人。" },
  { id: "blood-healing", works: ["bloodborne"], name: "血疗与古神之血", en: "Blood Healing / Old Blood", cat: "血源诅咒", text: "劳伦斯把拜伦维斯发现的古神之血稀释为「血疗」，使亚南成为治愈之城，也让居民在过度用血后兽化。威廉大师留下的警示「畏惧古神之血」，是全作对这条技术路线的最终判词。" },
  { id: "insight", works: ["bloodborne"], name: "灵视", en: "Insight", cat: "血源诅咒", text: "以「内在之眼」接近上位者而获得的理解力。灵视升高会改变亚南的可见形态：血月后亚米达拉显形、教堂区出现新的敌人、疯人的呓语变得可解。看见真相与保持理智，在本作里是同一条刻度线的两端。" },
  { id: "great-ones", works: ["bloodborne"], name: "上位者与神之子", en: "Great Ones / Infant Great One", cat: "血源诅咒", text: "非人、非善恶、以「血」「眼」「梦」与人类交感的超越性存在：月之血姬、科斯、伊碧塔丝、罗姆、梅高、亚米达拉。游戏中反复提到「上位者极难孕育下一代」，于是整场狩猎之夜的底层动机，变成了一场关于「谁来成为神之子」的挑选。" },
  { id: "hunters-dream", works: ["bloodborne"], name: "猎人梦境", en: "Hunter's Dream", cat: "血源诅咒", text: "杰尔曼借三分之一脐带与月之血姬相遇后构筑的空间，猎人在此重生、以血之回响强化自身、由人偶照料。它让「死亡—重试」这一玩法获得了世界观内的解释，也把主角变成了上位者计划里的一环。" },
  { id: "beasthood", works: ["bloodborne"], name: "兽化与兽灾", en: "Beasthood / Scourge of the Beast", cat: "血源诅咒", text: "过度依赖血液使人失去理性、化为野兽。游戏用「兽化条」「怪兽之血」等机制把诱惑做成可玩的东西：越贴近野兽越强大，也越接近再也回不来。旧亚南被教会焚毁，正是这条逻辑推到极端的后果。" },
  { id: "curse-of-kos", works: ["bloodborne"], name: "科斯的诅咒", en: "Curse of Kos", cat: "血源诅咒", text: "拜伦维斯学者与早期猎人在渔村对科斯及其孤儿的屠戮，招致上位者的诅咒：所有参与者被拖入「猎人噩梦」，永不得安宁。《老猎人》整部资料片都是这场旧罪的事后审判。" },
  { id: "golden-order", works: ["er"], name: "黄金律法", en: "Golden Order", cat: "艾尔登法环", text: "由艾尔登法环所规定、经玛莉卡与黄金树施行的世界秩序，其根本为「因果」与「回归」。二指传达无上意志，三指被封于王城地下代表癫火；律法是否应当被「修复」、以及用什么修复，构成本作的结局分歧。" },
  { id: "elden-ring", works: ["er"], name: "艾尔登法环与大卢恩", en: "Elden Ring / Great Runes", cat: "艾尔登法环", text: "规定世界之理的律法集合，玛莉卡击碎后，碎片成为大卢恩落入半神之手，引发无人获胜的破碎战争。褪色者收集大卢恩、以「修复用卢恩」决定新秩序；游戏内九把「传说武器」正是这段神话的物证。" },
  { id: "grace", works: ["er"], name: "赐福与褪色者", en: "Grace / Tarnished", cat: "艾尔登法环", text: "黄金树赐予的金色指引，失去赐福者眼中光芒褪去、被逐出交界地，称为褪色者。法环破碎后赐福再度召唤他们归来——既是导航光柱与存档点，也是「被秩序抛弃者反而成为秩序修复者」的叙事装置。" },
  { id: "rune-of-death", works: ["er"], name: "死之卢恩与死诞者", en: "Rune of Death / Those Who Live in Death", cat: "艾尔登法环", text: "玛莉卡把「命定之死」从律法中剔除，交由黑剑玛利喀斯封印，黄金树时代于是有了「不死」的赐福。菈妮窃取它并用以杀死葛德文的灵魂，使死亡重新以畸形方式回流——「死诞者」由此诞生。" },
  { id: "divine-heir", works: ["sekiro"], name: "龙胤与不死", en: "Divine Heritage / Dragon's Blood", cat: "只狼", text: "源自樱龙的血脉，使御子不老不伤、死而复生，并可把不死授予侍从。它并非恩赐：回生以剥夺他人生命力为代价，累积成「龙咳」；变若之水、附虫者、破戒僧则是人类模仿不死所造出的扭曲变体。" },
  { id: "posture", works: ["sekiro"], name: "架势与忍杀", en: "Posture / Shinobi Execution", cat: "只狼", text: "以弹反、连续攻防破坏敌人身体平衡，架势条满后一击「忍杀」。它把魂系的「体力管理」改写为「节奏对抗」，也使本作的每一场决斗都更像一次剑戟对话，而非消耗战。" },
  { id: "dragonrot", works: ["sekiro"], name: "龙咳", en: "Dragonrot", cat: "只狼", text: "因过度使用「回生」而在他人身上蔓延的消耗性疾病，NPC 会咳嗽、病情加重乃至死亡，须以「龙咳之药」解除。系列第一次把「主角可以无限重来」这件事，明码标价地记到了别人身上。" },
  { id: "moonlight", works: ["ds1", "ds2", "ds3", "er", "bloodborne"], name: "月光大剑：跨作品母题", en: "Moonlight Greatsword", cat: "跨作品", text: "源自 FromSoftware 1994 年处女作《国王密令》，此后几乎每部作品都有一把泛着月光的巨剑：黑魂三部曲的「月光大剑」、《血源》的「月光圣剑」、《艾尔登法环》的「暗月大剑」。获取方式一部比一部曲折，且总与「龙」「月」「女性引导者」相连。" },
  { id: "fragmented", works: ["ds1", "ds2", "ds3", "er", "sekiro", "bloodborne"], name: "碎片化叙事", en: "Environmental Storytelling", cat: "叙事手法", text: "宫崎英高作品最核心的表达方式：剧情主要写在道具说明、场景陈设、敌人配置、NPC 半句话与音乐里，而非过场动画。因此同一段故事常有多种互相竞争的解读；本站对明确写于游戏内的信息直述，对推论性内容一律标注「解读／推测」。" },
  { id: "patches", works: ["ds1", "ds3", "er", "bloodborne"], name: "帕奇：跨作品常数", en: "Patches", cat: "跨作品", text: "从《恶魔之魂》起反复出现的圆头商人，惯以「请你往下看」「把桥收起来」坑害玩家，却又常在关键时刻帮忙。在几乎不提供确定答案的这些世界里，他是少数可被依赖的常数。" }
];

/* 美术档案说明：站内图为原创概念图，非官方原画 */
const ART_NOTES = [
  { file: "hero-bonfire.jpg", work: "首页", title: "余火与双剑", note: "篝火、灰烬、哥特废墟与插于灰中的剑——对应「传火」这一贯穿三部曲的意象。" },
  { file: "ds1-anor-londo.jpg", work: "黑暗之魂：重制版", title: "亚诺尔隆德黄昏", note: "神都的高耸拱券、沉默的骑士与将熄的圣火。" },
  { file: "ds2-drangleic.jpg", work: "黑暗之魂 II：原罪学者", title: "雾海中的空王座", note: "对应渴望王座、遗忘与海岸边的多兰古雷格。" },
  { file: "ds3-firelink.jpg", work: "黑暗之魂 III", title: "空王座与余烬", note: "传火祭祀场的五个王座与火之末裔。" },
  { file: "er-erdtree.jpg", work: "艾尔登法环", title: "黄金树下的褪色者", note: "金黄的光、悬浮的卢恩碎片与孤独的旅人。" },
  { file: "sekiro-ashina.jpg", work: "只狼：影逝二度", title: "苇名的月夜", note: "雪、樱花、天守阁与独臂忍者的剪影。" },
  { file: "bloodborne-yharnam.jpg", work: "血源诅咒", title: "血月下的亚南", note: "维多利亚哥特尖塔、石像鬼与提灯的猎人。" }
];

/* 资料来源与编写原则 */
const SOURCES = [
  { name: "游戏内文本", desc: "道具说明、NPC 台词、誓约与结局文本，是本辞典事实性描述的第一依据。", url: "" },
  { name: "官方站点与商店页", desc: "发售日期、平台、DLC 名称以 FromSoftware / Bandai Namco / PlayStation 官方页面及 Steam 商店信息为准。", url: "https://www.fromsoftware.jp/" },
  { name: "维基百科（中文）", desc: "用于核对作品年表、剧情梗概与中文条目名；各作品页均附对应条目链接。", url: "https://zh.wikipedia.org/wiki/%E9%AD%82%E7%B3%BB%E5%88%97" },
  { name: "Fextralife 社区维基（英文）", desc: "用于核对英文名、装备获取路径与人物称号；各作品页附对应分站入口。", url: "https://darksouls.wiki.fextralife.com/Dark+Souls+Wiki" },
  { name: "中文社区考据", desc: "游民星空、A9VG、萌娘百科等剧情解析，用于交叉核对通行中文译名与剧情脉络。", url: "" }
];

const NOTES = [
  "译名：以简体中文通行译法为主，并保留英文原名；不同版本、地区与社区存在译名差异（例如「原罪学者／原罪哲人」、「艾雷德尔之烬／阿里安德尔的灰烬」、「落叶／洛阳」），一律以英文原名消歧。",
  "剧情：宫崎英高作品大量采用碎片化叙事，许多因果并无唯一官方答案。本站对游戏内明示的内容直述，对社区推论以「解读／暗示／推测」标注，不把同人考据当作定论。",
  "图像：站内所有人物 / 场景配图均为本站委托 AI 生成的原创氛围概念图，不是 FromSoftware 的官方原画或设定稿；各作品页提供官方站点与资料库外链，供查阅官方美术与原始资料。",
  "版权：游戏名称、角色名、世界观与相关美术的著作权归 FromSoftware、Bandai Namco Entertainment、Sony Interactive Entertainment、Activision 等权利人所有。本站为非商业、非官方的爱好者资料索引。"
];
