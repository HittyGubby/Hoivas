import type { Node, Edge } from "@xyflow/svelte";

export const PB_CHART_DATA = {
  labels: [
    "新帝国主义",
    "专制主义",
    "反动主义",
    "保守主义",
    "自由主义",
    "无政府自由主义",
    "国家社会主义",
    "雅各宾派"
  ],
  datasets: [
    {
      data: [3,3,18,45,8,3,18,2],
      backgroundColor: [
        "#314F4F",
           "#6E6E6E",
           "#4C4040",
           "#776A31",
           "#324A77",
           "#775A31",
           "#773131",
           "#630808"
      ],
      borderWidth: 0,
      spacing: 0,
    },
  ],
  options: {
    rotation: 90,
  },
};

export const PB_SPIRITS = [
  { url: "/pb/preset/PB_ENG_Land_of_Hope.png", scale: 1.0 },
  { url: "/pb/preset/PB_ENG_Postwar_Pacifism.png", scale: 1.0 },
  { url: "/pb/preset/PB_ENG_Economic_Stagnation.png", scale: 1.0 },
  { url: "/pb/preset/PB_ENG_Imperial_Confederation_Head.png", scale: 1.0 },
];

export const PB_INITIAL_NODES: Node[] = [
  {
    id: "main-init",
    type: "mainWindow",
    position: { x: 0, y: 0 },
    data: {
      country: "<p>帝国合众联邦</p>",
      leaderName: "<p>HRM Victoria</p>",
      factionText: "<p>国际联盟</p>",
      partyName: "<p>PNUS</p>",
      ideologyName: "<p>专制主义</p>",
      electionText: "<p>无选举</p>",
      focusText: "<p>未知国策</p>",
      factionScale: 1.0,
      flagImg: "/pb/preset/ENG.png",
      leaderImg: "/pb/preset/Portrait_ENG_Victoria_2.png",
      factionImg: "/pb/preset/faction_League_of_Nations.png",
      ideologyImg: "/pb/preset/NI_VARIANT_09.png",
      focusImg: "/pb/preset/goal_unknown.png",
      focusScale: 0.9,
      ideologyScale: 1.0,
      progress: 0,
      chartData: PB_CHART_DATA,
    },
    width: 550,
    height: 260,
  },
  {
    id: "spirit-init",
    type: "spirit",
    position: { x: 525, y: 5 },
    data: {
      spirits: PB_SPIRITS,
    },
    width: 512,
    height: 200,
  },
  {
    id: "news-init",
    type: "news",
    position: { x: 870, y: 150 },
    data: {
      title: "<p>欧洲战争打响</p>",
      body: `<p>欧洲再次陷入世界大战的战火之中。复仇主义的法国向东进军，企图从德国手中夺回霸权，而西进的俄军则为其提供支持。大英帝国及其保护国也介入战争，援助被围困的德军。</p><p><br></p><p>在远东，日本和中国准备向莫斯科发起猛攻，誓要报复莫斯科。</p><p><br></p><p>第二次世界大战，一个噩梦新时代的延续，已经爆发。</p>`,
      buttonText: "<p>向胜利前进！</p>",
      newsImg: "/pb/preset/PBNews_Second_Great_War.png",
      newsheaderImg: "/pb/preset/nazist-Germany.png",
    },
    width: 500,
    height: 560,
  },
  {
    id: "desc-init",
    type: "desc",
    position: { x: 6, y: 250 },
    data: {
      body: `<p><span style="color: #cccc00; font-weight: bold">HRM Victoria</span></p><p>-----------</p><p>维多利亚女王，原名亚历山德里娜·维多利亚，可以说是目前在世最长寿的人之一，尽管一些叛逆的卢德分子可能会质疑她是否是人类。维多利亚于1837年登基，统治着大英帝国，见证了19世纪帝国发展的关键时期。尤其值得一提的是，她私下支持英联邦的废奴运动，最终促成了英属北美废奴制度的终结。女王嫁给了萨克森-科堡-哥达的阿尔伯特亲王，在帝国政治中扮演着某种程度上的中立观察者的角色，利用王室成员轮流居住的制度来赢得各组成联邦的支持。</p><p>
      1894年，她的人生发生了翻天覆地的变化。当时，查尔斯·J·吉托在她聆听美国总理尼尔·道的演讲时向她开了三枪。历史学家们对吉托袭击的确切原因争论不休，因为吉托本人在逃跑后不久就被美国皇家骑警击毙。维多利亚女王身中两枪，被紧急送往附近医院接受治疗。第二天早上，女王的病情趋于稳定。爱迪生电气公司旗下的爱迪生医疗公司的代表向女王和王室成员提出了一项未经检验的激进疗法。维多利亚女王不顾丈夫的反对，同意接受这项疗法，并进行了长达18个小时的手术。她成为首批成功接受外科手术和器官移植的人类之一，堪称帝国科技实力的活生生的胜利。</p><p>
      尽管在阿尔伯特亲王去世后，女王的公众形象有所减少，但她仍然是英国帝国神话的支柱。然而，随着时间的推移，她的子女和孙辈逐渐长大成人，人们逐渐意识到，只要女王继续执政，他们可能终其一生都无法继承王位。女王及其拥护者深知这一点，因此选择将他们中的大多数人派往殖民地担任总督或顾问，担心宫廷阴谋会成为破坏稳定的因素。</p><p>
      当欧洲的灯光再次黯淡，美国也开始寻求自己的道路时，永恒女皇的形象却始终存在。对一些人来说，她是希望和科技进步的象征；对另一些人来说，她则是未来永生贵族统治的可怕预兆，预示着一个丧失人性的人类，从今日起统治世界直至末日。</p>`,
    },
    width: 320,
    height: 400,
  },
  {
    id: "event-init",
    type: "event",
    position: { x: 1350, y: 190 },
    data: {
      title: "<p>第二次大战结束</p>",
      body: `<p>随着第二次大战的结束，国际联盟启动了军事法庭，以监督对法国和俄罗斯领导人的惩罚。英国尤其负责监督对多名法国官员的审判，由此我们得以了解法国境内无数侵犯人权的行径。</p><p><br></p><p>尽管大量文件被销毁，但似乎存在着对欧洲大片地区进行大规模人口灭绝的明确意图，这将是一场人类历史上前所未有的种族灭绝。审判本身进行得相对迅速，几乎所有被捕官员都被判处绞刑。在东方，国际联盟俄罗斯军事法庭一直在努力处理剩余的俄罗斯效忠者。为了维护稳定，前俄罗斯皇室成员在托管地获得了有条件的特赦，直至内战结束。虽然我们有可能证明他们的罪行，但处决这些重要政治人物的代价太大，而且对战后秩序构成太大威胁。</p>`,
      buttonText: ["<p>吊死皇室亲属可能有点过分。</p>"],
      eventImg: "/pb/preset/British_Crackdown.png",
    },
    width: 500,
    height: 600,
  },
  {
    id: "super-init",
    type: "super",
    position: { x: 330, y: 170 },
    data: {
      title: "<p>第二次大战</p>",
      motto: `<p>“凭借这一原则，</p><p>也许你将有生之年见识到超乎你想象的、</p><p>由人类制造的恐怖之物。”</p><p>- 尼古拉·特斯拉</p>`,
      buttonText: "<p>地狱之门敞开</p>",
      superImg: "/pb/preset/SPEVNT_Second_Great_War.png",
    },
    width: 550,
    height: 480,
  },
];

export const PB_INITIAL_FOCUS_NODES: Node[] = [
  {
    id: "focus-init-1",
    type: "focus",
    position: { x: 200, y: 50 },
    data: {
      icon: "/pb/preset/ENG_Benevolent_Dictatorship.png",
      label: "<p>仁爱独裁</p>",
      status: "completed",
      scale: 1.0,
      verticalOffset: 0,
    },
  },
  {
    id: "focus-init-2",
    type: "focus",
    position: { x: 100, y: 200 },
    data: {
      icon: "/pb/preset/ENG_British_Imperial_Federation.png",
      label: "<p>帝国联邦</p>",
      status: "inProgress",
      scale: 1.0,
      verticalOffset: 0,
    },
  },
  {
    id: "focus-init-3",
    type: "focus",
    position: { x: 300, y: 200 },
    data: {
      icon: "/pb/preset/ENG_Colonial_Policies.png",
      label: "<p>殖民政策</p>",
      status: "unavailable",
      scale: 1.0,
      verticalOffset: 0,
    },
  },
];

export const PB_INITIAL_FOCUS_EDGES: Edge[] = [
  {
    id: "focus-edge-1-2",
    source: "focus-init-1",
    target: "focus-init-2",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "focusStep",
    data: { dashed: false, exclusive: false, completed: true },
  },
  {
    id: "focus-edge-1-3",
    source: "focus-init-1",
    target: "focus-init-3",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "focusStep",
    data: { dashed: true, exclusive: false, completed: false },
  },
  {
    id: "focus-edge-2-3",
    source: "focus-init-2",
    target: "focus-init-3",
    sourceHandle: "right",
    targetHandle: "left",
    type: "focusStep",
    data: { dashed: false, exclusive: true, completed: false },
  },
];
