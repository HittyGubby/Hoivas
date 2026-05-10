import type { Node, Edge } from "@xyflow/svelte";

export const TNO_CHART_DATA = {
  labels: [
    "秘传纳粹主义",
    "极端民族主义",
    "国家社会主义",
    "法西斯主义",
    "专制主义",
    "家长制民主",
    "保守主义",
    "自由保守主义",
    "自由主义",
    "进步主义",
    "社会主义",
    "共产主义",
  ],
  datasets: [
    {
      data: [0, 5.6, 30.6, 41.7, 11.1, 8.3, 2.1, 0, 0, 2, 1.4, 0],
      backgroundColor: [
        "#341950",
        "#232323",
        "#503200",
        "#843200",
        "#4b4b4b",
        "#828282",
        "#000087",
        "#273195",
        "#4e61a3",
        "#a91b4f",
        "#9b0000",
        "#6e0000",
      ],
      borderWidth: 0,
      spacing: 0,
    },
  ],
  options: {
    rotation: 90,
  },
};

export const TNO_SPIRITS = [
  { url: "/tno/preset/Reich_GER_idea_GER_endsieg_old.png", scale: 1.0 },
  { url: "/tno/preset/Reich_GER_idea_GER_gone_over.png", scale: 1.0 },
  { url: "/tno/preset/Reich_GER_idea_GER_the_two_principles.png", scale: 1.0 },
  { url: "/tno/preset/Reich_GER_idea_GER_to_banish_want.png", scale: 1.0 },
];

export const TNO_INITIAL_NODES: Node[] = [
  {
    id: "main-init",
    type: "mainWindow",
    position: { x: 0, y: 0 },
    data: {
      country: "<p>大日耳曼国</p>",
      leaderName: "<p>国会紧急委员会</p>",
      factionText: "<p>团结协定</p>",
      partyName: "<p>纳粹党</p>",
      ideologyName: "<p>国家社会主义</p>",
      electionText: "<p>无选举</p>",
      focusText: "<p>未知国策</p>",
      factionScale: 0.7,
      flagImg: "/tno/preset/GER.png",
      leaderImg: "/tno/preset/Portrait_GER_Reichstag_Emergency_Council.png",
      factionImg: "/tno/preset/Leader-Einheitspakt.png",
      ideologyImg: "/tno/preset/national_socialism_group.png",
      focusImg: "/tno/preset/goal_unknown.png",
      focusScale: 0.9,
      ideologyScale: 1.0,
      progress: 0,
      chartData: TNO_CHART_DATA,
    },
    width: 550,
    height: 260,
  },
  {
    id: "spirit-init",
    type: "spirit",
    position: { x: 525, y: 5 },
    data: {
      spirits: TNO_SPIRITS,
    },
    width: 512,
    height: 200,
  },
  {
    id: "news-init",
    type: "news",
    position: { x: 870, y: 150 },
    data: {
      title: "<p>德国内战</p>",
      body: `<p>在阿道夫·希特勒去世后，德国旋即陷入混乱。尽管元首指定了合法的继任者，但德国国内的强大派系已经开始拿起武器，互相对抗，打算将国家引导向自己的期望。国家已被分裂，整支整支的驻军无视来自日耳曼尼亚的命令，并倒向他们选择的继任者。虽然局势的严重程度尚不清楚，但据估计，德国要么正在面临要么已经经历了中央权威的彻底崩溃。</p><p><br></p><p>虽然还不大清楚德国东部领地的命运将会如何，但日耳曼尼亚与她的殖民领之间突然断绝了联系，这已经引发了这些地区是否也会自行寻找出路的猜测。然而，有一点毫无疑问，这个欧洲巨人的崩溃已经使整个欧陆陷入分崩离析之中。</p>`,
      buttonText: "<p>帝国的终结。</p>",
      newsImg: "/tno/preset/GER_german_civil_war.png",
      newsheaderImg: "/tno/preset/nazist-Germany.png",
    },
    width: 500,
    height: 560,
  },
  {
    id: "desc-init",
    type: "desc",
    position: { x: 6, y: 250 },
    data: {
      body: `<p><span style="color: #cccc00">国会紧急委员会</span></p><p>-----------</p><p>元首已不幸病故，举国震惊。毕竟，谁能想到这位不可战胜之人会这样死去呢？但国会对此早有准备。尽管元首早已点出他的继承者，但政府内部依然各执一词。改革派、保守派、强硬派、狂热派互相撕咬，和平有序进行权力交接的幌子顷刻间烟消云散。斗争的结果是，一群中间派、无名官僚和不受其他派系欢迎的国会议员们联合起来，遵循着三十年来为众人所忽视的宪法，宣布成立过渡行政机关，直至新任元首宣誓就职。元首之位的主要竞争者都对紧急委员会漠不关心，对他们而言，委员会充其量只是群坐冷板凳的家伙；若以冷眼观之，那么他们就是桀骜不驯的叛徒。唯一值得欣慰的是，他们的存在给日耳曼尼亚带来了一丝脆弱的稳定，防止这座城市陷入混乱，如此便可能会有一位更有能力的领导人出来重掌大局，希望如此。他们或许可以保住罗马不在烈火中化为废墟，却无法阻止帝国的其他部分被烈焰所吞噬。</p>`,
    },
    width: 320,
    height: 400,
  },
  {
    id: "event-init",
    type: "event",
    position: { x: 1350, y: 0 },
    data: {
      title: "<p>内战打响！</p>",
      body: `<p>多年以来，虽然国内各派系之间的紧张局势一直在加剧，但谁都没有想到，元首尸骨未寒，暴力冲突就爆发了。当然，人人都能看见，政客们躲回了自己的老巢，军队分发了装备并封锁了道路，警察则拿起了他们手头上最强大的武器，用路障封锁了他们的警察局，但谁能想到，将要降临的是一场彻底的内战呢？</p><p><br></p><p>然而，不管人们想没想到，战争就这样发生了。部队在日耳曼尼亚倾注了全部注意力，确保首都处于军方的控制之下，不过在其他地方，追求着德意志祖国无上权柄的觊觎者们已经武装起来，战斗一触即发。施佩尔、海德里希、鲍曼、戈林，没有人知道谁会获得最终胜利，不过这个国家的所有民众都知道，他们未来的日子一片黑暗。</p><p><br></p><p>德国正在崩溃，城市街头陷入无政府状态，饕餮列强们争论着如何行动。英国和日本都在寻找从这场混乱中渔利的最佳时机，伊比利亚与意大利迅速开始军事化，趁着这混乱将自身的彩响力撒播出去。表面上对祖国忠心耿耿的专员辖区们也陷入了争吵，领导人们争论着该支持谁，或者是否是时候乘机开始将自己的领地与故乡拉开距离、划清界线。</p>`,
      buttonText: ["<p>血色将至。</p>"],
      eventImg: "/tno/preset/Reich_Germany_report_event_GER_riot.png",
    },
    width: 500,
    height: 600,
  },
  {
    id: "super-init",
    type: "super",
    position: { x: 330, y: 240 },
    data: {
      title: "<p>德国内战</p>",
      motto: `<p>因此，所有人都必须认识到这一点：</p><p>与国家的存在相比，他的自我毫无意义。</p><p>- 阿道夫·希特勒</p>`,
      buttonText: "<p>风云已起</p>",
      superImg: "/tno/preset/german_civil_war.png",
    },
    width: 550,
    height: 480,
  },
];

export const TNO_INITIAL_FOCUS_NODES: Node[] = [
  {
    id: "focus-init-1",
    type: "focus",
    position: { x: 200, y: 50 },
    data: {
      icon: "/tno/preset/GER_focus_GER_a_helping_hand.png",
      label: "<p>伸出援手</p>",
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
      icon: "/tno/preset/GER_focus_GER_aid_for_the_present.png",
      label: "<p>支援现状</p>",
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
      icon: "/tno/preset/GER_focus_GER_a_lighter_hand.png",
      label: "<p>放宽控制</p>",
      status: "unavailable",
      scale: 1.0,
      verticalOffset: 0,
    },
  },
];

export const TNO_INITIAL_FOCUS_EDGES: Edge[] = [
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
