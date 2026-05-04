import type { Node, Edge } from "@xyflow/svelte";

export const DEFAULT_CHART_DATA = {
  labels: [
    '争取社会主义和解放党（反修派）',
    '争取社会主义和解放党（温和派）',
    '美国民主社会主义者',
    '民主党（进步派）',
    '民主党（自由派）',
    '自由意志党',
    '共和党（保守派）',
    '共和党（民粹派）',
    '美国武装力量',
    '爱国者阵线',
    '民族社会主义运动'
  ],
  datasets: [
    {
      data: [0, 1, 3, 8, 40, 5, 42, 1, 0, 0, 0],
      backgroundColor: [
        '#640000', '#990000', '#BD3643', '#FF0A66',
        '#FFAA1E', '#E1D700', '#0A0FFF', '#7C7C7C',
        '#050505', '#7B542E', '#4E3939'
      ],
      borderWidth: 0,
      spacing: 0,
    },
  ],
  options: {
    rotation: 90,
  },
};

export const DEFAULT_SPIRITS = [
  { url: "/preset/USA_USA_america_first.png", scale: 1.0 },
  { url: "/preset/USA_USA_constitutional_protections.png", scale: 1.0 },
  { url: "/preset/USA_USA_immigration.png", scale: 1.0 },
  { url: "/preset/USA_USA_political_division.png", scale: 1.0 },
  { url: "/preset/USA_USA_political_establishment.png", scale: 1.0 },
  { url: "/preset/USA_USA_the_trump_economy.png", scale: 1.0 },
  { url: "/preset/USA_USA_second_ammendment.png", scale: 1.0 },
  { url: "/preset/USA_USA_world_police.png", scale: 1.0 },
];

export const INITIAL_NODES: Node[] = [
  {
    id: "main-init",
    type: "mainWindow",
    position: { x: 0, y: 0 },
    data: {
      country: "美利坚合众国",
      leaderName: "唐纳德·特朗普",
      factionText: "北大西洋公约组织",
      partyName: "共和党（保守派）",
      ideologyName: "特朗普民粹主义",
      electionText: "下次大选<span style='color: sandybrown;'>2020年11月</span>",
      focusText: "未知国策",
      factionScale: 1.0,
      factionImg: "/preset/GFX_NATO_Member.png",
      ideologyImg: "/preset/right_populism_USA.png",
      focusImg: "/preset/goal_unknown.png",
      focusScale: 0.9,
      ideologyScale: 1.0,
      progress: 50,
      chartData: DEFAULT_CHART_DATA
    },
    width: 550,
    height: 260,
  },
  {
    id: "spirit-init",
    type: "spirit",
    position: { x: 8, y: 238 },
    data: {
      spirits: DEFAULT_SPIRITS
    },
    width: 512,
    height: 200
  },
  {
    id: "news-init",
    type: "news",
    position: { x: 500, y: 0 },
    data: {
      title: "国会拒绝交涉",
      body: "或许将被后世称为二十一世纪最悲惨的事件在今日已经撼动了整个美国。丹佛和华盛顿特区的两国政府已经拒绝通过外交谈判和平结束当前的危机，当特朗普和拜登都声称他们是国家合法总统时，伊利诺伊州和印第安纳州边境的临时停火线上的民兵间爆发了零星战斗，拜登的民兵向伊利诺伊州的丹维尔推进，而特朗普的民兵则试图通过接连开火夺取边境城市，熊熊烈焰从芝加哥的大楼上升起。有报道称，丹佛的反战活动家被无标记的面包车强行带下街头；而在路易斯维尔，亲特朗普的抗议活动被联邦军队强行驱散。尽管特朗普政府在维持城市秩序方面遭遇了重大困难，但拜登政府也未将控制区延伸至高速公路和城市之外，地下民兵已经开始着手武装伏击军队车队。千千万万的美国家庭惊恐注视着美国社会结构的彻底粉碎。当同为亲朋骨肉的美国人互相厮杀之时，让人不可置否的现实是，第二次美国内战已经真正打响。",
      buttonText: "骨肉再次相残。",
      newsImg: "/preset/Tank_Duel.png"
    },
    width: 500,
    height: 600
  },
  {
    id: "desc-init",
    type: "desc",
    position: { x: 8, y: 430 },
    data: {
      body: "<span style='color: #cccc00; '>唐纳德·特朗普</span><br>-----------<br>唐纳德·约翰·特朗普是当代美国最具有分裂性的政治家。身为纽约房地产大亨弗雷德·特朗普的儿子，将父亲的公司从一个酒店和赌场连锁企业，转变成了以他个人形象为招牌的国际品牌。他在2000年和2012年尝试过涉足政坛，最终在2016年总统选举中全力投入。经过一连串的爆冷，他最终获得共和党提名，并在大选中击败了前参议员和第一夫人希拉里·克林顿，成为美国总统。<br><br>特朗普从政策到个性的方方面面都颠覆了华盛顿特区所崇尚的老派形象。他信奉商业哲学：不做不能立即给自己带来实际利益的交易，绝不存在任何负面新闻，以及出现问题时绝不承认失败。支持者赞赏他的坦率，认为他敢于为中西部受挫的民众发声，敢于挑战迂腐的联邦体制。然而，众多批评者也谴责其肤浅自负，过于迎合极右翼分子，为了自己的虚荣不惜摧毁民主传统。但无论是支持还是反对，人们都难以否认，他拥有能激怒或煽动任何团体的魔力。"
    },
    width: 320,
    height: 400
  },
  {
    id: "event-init",
    type: "event",
    position: { x: 950, y: 45 },
    data: {
      title: "主要城市发生暴乱",
      body: "在全国各大城市，暴力事件接连不断地发生，执法部门和“运动”之间的冲突日益升级，重要基础设施遭到破坏已经是无可避免的了。铁路、公路、电车和公共汽车等在不同的地区不断遭到严重破坏，在“运动”以某种方式被平息之前，这种破坏将继续下去。<br><br>“运动”的所言通过媒体渠道得到传播，从而降低了破坏的严重程度，同时也阻止了我们采取更加激烈的应对措施——即使我们有意这样做。",
      buttonText: "暴乱解决不了任何问题！",
      eventImg: "/preset/USA_major_city_riots.png"
    },
    width: 400,
    height: 800
  },
  {
    id: "super-init",
    type: "super",
    position: { x: 338, y: 540 },
    data: {
      title: "第二次美国内战",
      motto: "“如果毁灭是我们的命运，我们必须自己成为它的创造者和终结者。作为一个自由人的国家，我们将永远活着，或者自我灭亡。”<br>- 亚伯拉罕·林肯",
      buttonText: "自相分争之家",
      superImg: "/preset/super_USA_civil_war.png"
    },
    width: 800,
    height: 500
  }
];

export const INITIAL_FOCUS_NODES: Node[] = [
  {
    id: "focus-init-1",
    type: "focus",
    position: { x: 200, y: 50 },
    data: { icon: "/preset/USA_USA_enforce_order.png", label: "保持秩序", status: "completed" },
  },
  {
    id: "focus-init-2",
    type: "focus",
    position: { x: 100, y: 200 },
    data: { icon: "/preset/USA_USA_invoke_the_insurrection_act.png", label: "通过叛乱法", status: "inProgress" },
  },
  {
    id: "focus-init-3",
    type: "focus",
    position: { x: 300, y: 200 },
    data: { icon: "/preset/USA_USA_lasting_peace.png", label: "持久和平", status: "unavailable" },
  },
];

export const INITIAL_FOCUS_EDGES: Edge[] = [
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
