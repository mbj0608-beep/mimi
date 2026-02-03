import { GameEvent, CatStats } from './types';

export const ASSETS = {
  BG_IMAGE: 'https://gz-vchar-pub.nosdn.127.net/5b195f39-2276-4cd1-b4a2-8ca859e369ef.png',
  CAT_IMAGE: 'https://gz-vchar-pub.nosdn.127.net/a4c09764-388a-475a-b6c8-2f78ac093b78.png',
};

export const INITIAL_STATS: CatStats = {
  health: 80,
  stamina: 80,
  mood: 70,
  hunger: 70,
  trust: 30,
  wildness: 50,
  dignity: 50,
};

export const RADIO_SCRIPTS: Record<number, string> = {
  1: "滋...滋... 这里是自由之声。前线的战火已经蔓延到了第三街区。请所有居民...滋...尽可能留在室内，不要在此刻试图穿越封锁线。愿平安。",
  5: "滋... 据报道，西部城区的粮仓遭到了轰炸。物资供应将变得更加紧缺。有传言说，救援队正在尝试从南面突围。",
  10: "这里是自由之声。在这个寒冷的夜晚，如果你还在废墟中坚持... 不要放弃。我们看到了信号弹，盟军的飞机正在靠近。",
  15: "滋... 街上的巡逻队增加了。不管是人还是动物，如果被发现携带违禁品... 滋... 后果自负。最近因为饥饿发生的冲突越来越多了。",
  20: "咳咳... 播音室的电力不足了。我们可能无法每天播报。但请相信，停火协议正在谈判桌上。黎明前的黑暗总是最难熬的。",
  25: "滋...滋... 坚持住！敌军的包围圈出现了缺口。难民队伍正在向东撤离。如果你能听到，请往东看，那里的烟雾变少了。",
  30: "市民们... 战争... 结束了。滋... 双方于今早签署了停火协议。寂静重新回到了这片土地。我们可以回家了。重复，战争结束了。",
};

export const DEFAULT_RADIO = "滋...滋... 只有无尽的电流声和远处的炮火声混杂在一起。";

// A rich library of offline events focusing on war, humanity, and survival.
export const OFFLINE_EVENTS: GameEvent[] = [
  // --- 觅食/生存类 ---
  {
    id: 'f_trash_can',
    title: '倒塌的便利店',
    description: '昔日明亮的便利店如今只剩下一半墙壁。你在瓦砾下嗅到了发霉面包的气味，但头顶的钢筋摇摇欲坠。',
    choices: [
      {
        text: '冒险钻进去',
        effectDescription: '你小心翼翼地钻进去，找到了一块变硬的面包。虽然很难吃，但至少能填饱肚子。',
        statChanges: { hunger: 25, stamina: -5, mood: 5 }
      },
      {
        text: '太危险了，离开',
        effectDescription: '你放弃了。刚转身，一块碎石就砸在了你刚才想去的地方。你保住了小命，但肚子依然空空。',
        statChanges: { hunger: -10, stamina: -5, health: 5 }
      }
    ]
  },
  {
    id: 'f_dead_bird',
    title: '不幸的信使',
    description: '一只鸽子倒在路边，似乎是被流弹击中的。它的身上绑着一个小小的信筒。它是食物，也是信息的载体。',
    choices: [
      {
        text: '吃掉它',
        effectDescription: '战争年代，生存是第一位的。你吃了一顿像样的肉，尽管心里有点别扭。',
        statChanges: { hunger: 30, wildness: 10, dignity: -5 }
      },
      {
        text: '埋葬它',
        effectDescription: '你用土掩埋了它。也许它带来的是和平的信件？你感到一阵莫名的崇高。',
        statChanges: { hunger: -10, dignity: 15, mood: 10, wildness: -10 }
      }
    ]
  },
  {
    id: 'f_soldier_ration',
    title: '被遗忘的军粮',
    description: '一个行军背包被丢弃在战壕边，里面露出了半盒午餐肉罐头。周围弥漫着硝烟味。',
    choices: [
      {
        text: '大快朵颐',
        effectDescription: '太美味了！这是你这周吃过最好的一顿。高热量的食物让你充满了力量。',
        statChanges: { hunger: 50, health: 10, mood: 15 }
      },
      {
        text: '警惕陷阱',
        effectDescription: '你的直觉是对的，这附近埋着地雷。你小心地绕开了，虽然饿着肚子，但安全第一。',
        statChanges: { hunger: -5, wildness: 5, stamina: -5 }
      }
    ]
  },
  // --- 人性/互动类 ---
  {
    id: 'h_crying_child',
    title: '哭泣的孩童',
    description: '一个脏兮兮的小男孩坐在废墟上哭泣，他的腿受了伤。他手里拿着最后一块饼干。',
    choices: [
      {
        text: '去蹭蹭他',
        effectDescription: '你轻轻地蹭他的手。他停止了哭泣，把饼干分了一半给你，并摸了摸你的头。',
        statChanges: { hunger: 15, trust: 20, mood: 15 }
      },
      {
        text: '抢走饼干',
        effectDescription: '你扑上去抢走了饼干。男孩惊恐地尖叫。你吃饱了，但觉得自己像个怪物。',
        statChanges: { hunger: 20, trust: -20, dignity: -10, wildness: 20 }
      }
    ]
  },
  {
    id: 'h_old_musician',
    title: '废墟上的琴声',
    description: '一位老人坐在只剩三面墙的房子里拉小提琴，琴声凄凉而优美，与周围的轰炸声格格不入。',
    choices: [
      {
        text: '静静聆听',
        effectDescription: '音乐洗涤了你的灵魂。在这残酷的世界里，还有艺术存在。',
        statChanges: { mood: 30, dignity: 10 }
      },
      {
        text: '不耐烦地叫',
        effectDescription: '你觉得这声音很吵，破坏了你狩猎的专注。老人叹了口气，停下了演奏。',
        statChanges: { mood: -5, wildness: 5 }
      }
    ]
  },
  {
    id: 'h_deserter',
    title: '逃兵',
    description: '你遇到了一个躲在阴影里的士兵。他扔掉了枪，看起来精神崩溃，浑身发抖。',
    choices: [
      {
        text: '靠近他',
        effectDescription: '他把你抱在怀里痛哭："我不想杀人..." 他的体温让你在这个寒夜不再寒冷。',
        statChanges: { trust: 15, mood: 10, health: 5 }
      },
      {
        text: '对他哈气',
        effectDescription: '你嗅到了血腥味，对他充满敌意。他受惊逃跑了，丢下了一块巧克力。',
        statChanges: { hunger: 10, trust: -10, wildness: 10 }
      }
    ]
  },
  // --- 危险/战争类 ---
  {
    id: 'd_sniper',
    title: '红色的光点',
    description: '你在穿越街道时，发现胸口多了一个红色的光点。是狙击手！',
    choices: [
      {
        text: 'S型走位狂奔',
        effectDescription: '子弹打在你脚边的水泥地上，溅起火花。你拼命跑进了死角，心脏狂跳。',
        statChanges: { stamina: -20, mood: -20, wildness: 10 }
      },
      {
        text: '立刻装死',
        effectDescription: '你僵硬地倒下。狙击手似乎失去了兴趣。你在冰冷的地上躺了很久才敢动。',
        statChanges: { dignity: -10, stamina: -5, mood: -10 }
      }
    ]
  },
  {
    id: 'd_gas',
    title: '黄色的雾',
    description: '远处飘来一阵奇怪的黄色雾气，气味刺鼻，路边的老鼠接触到雾气后开始抽搐。',
    choices: [
      {
        text: '爬向高处',
        effectDescription: '你迅速爬上了最高的断墙。毒气比空气重，积聚在低处。你逃过一劫，但喉咙火辣辣的。',
        statChanges: { health: -10, stamina: -10 }
      },
      {
        text: '钻进地下室',
        effectDescription: '错误的决定！地下室充满了毒气。你剧烈咳嗽，差点死在里面，拼了命才爬出来。',
        statChanges: { health: -40, stamina: -20, mood: -20 }
      }
    ]
  },
  // --- 思考/环境类 ---
  {
    id: 'e_flower',
    title: '坦克下的花',
    description: '一辆废弃的生锈坦克下，奇迹般地开出了一朵白色的小花。',
    choices: [
      {
        text: '凝视它',
        effectDescription: '生命总会找到出路。这朵花给了你莫大的勇气。',
        statChanges: { mood: 20, dignity: 5 }
      },
      {
        text: '踩碎它',
        effectDescription: '在这个世界上，美好是脆弱且无用的。你在此刻只想宣泄愤怒。',
        statChanges: { mood: -5, wildness: 10 }
      }
    ]
  },
  {
    id: 'e_rain',
    title: '黑色的雨',
    description: '天空下起了黑色的雨，混合着灰烬和油污。每一滴雨水都冰冷刺骨。',
    choices: [
      {
        text: '寻找躲避',
        effectDescription: '你躲在一块塑料布下，虽然还是湿了，但至少没有淋透。你开始怀念以前温暖的窝。',
        statChanges: { mood: -10, stamina: -5, health: -5 }
      },
      {
        text: '在雨中奔跑',
        effectDescription: '你试图甩干身上的水，但这雨水像油一样粘。你感到非常不适。',
        statChanges: { health: -15, mood: -15, stamina: -10 }
      }
    ]
  },
  {
    id: 'h_mother_cat',
    title: '另一位母亲',
    description: '你遇到了一只叼着幼崽的母猫，她瘦骨嶙峋，警惕地盯着你。',
    choices: [
      {
        text: '分享一点食物',
        effectDescription: '你吐出之前藏在嘴里的一点食物。她感激地看了你一眼，叼着孩子离开了。',
        statChanges: { hunger: -15, trust: 10, dignity: 10, wildness: -5 }
      },
      {
        text: '恐吓驱赶',
        effectDescription: '这是你的地盘。你把她赶走了。为了生存，没有同情可言。',
        statChanges: { wildness: 10, dignity: -5, trust: -5 }
      }
    ]
  },
  {
    id: 'f_abandoned_kitchen',
    title: '幽灵厨房',
    description: '这栋房子的主人似乎刚刚离开，桌上还放着凉掉的汤。窗户被胶带封死。',
    choices: [
      {
        text: '喝汤',
        effectDescription: '汤有点酸了，但里面有土豆块。你饱餐了一顿。',
        statChanges: { hunger: 20, health: -5 }
      },
      {
        text: '搜寻柜子',
        effectDescription: '柜子里有一袋干猫粮！简直是奇迹！你疯狂地吃了起来。',
        statChanges: { hunger: 40, mood: 20 }
      }
    ]
  },
  {
    id: 'd_drone',
    title: '嗡嗡作响的怪物',
    description: '一个小型的四旋翼无人机在低空盘旋，发出令人不安的嗡嗡声，似乎在搜寻什么。',
    choices: [
      {
        text: '攻击它',
        effectDescription: '你跳起来试图拍打它。无人机被惊动，发出一道电击！你被电得浑身发麻。',
        statChanges: { health: -20, stamina: -10 }
      },
      {
        text: '藏在阴影里',
        effectDescription: '你屏住呼吸，一动不动，直到声音远去。最好的生存方式就是不被发现。',
        statChanges: { wildness: 5, stamina: -2 }
      }
    ]
  },
  {
    id: 'h_letter',
    title: '被风吹走的信',
    description: '一张信纸被风吹到了你的脸上。上面有着泪痕和模糊的字迹："亲爱的，如果我回不来..."',
    choices: [
      {
        text: '撕碎它',
        effectDescription: '纸屑纷飞，就像这个破碎的世界。你对人类的情感感到厌烦。',
        statChanges: { wildness: 5, mood: -5 }
      },
      {
        text: '压在石头下',
        effectDescription: '你把它小心地压好。也许收信人路过时能看到。做完这件事，你觉得心里暖暖的。',
        statChanges: { mood: 10, dignity: 5 }
      }
    ]
  },
  {
    id: 'rest_dream',
    title: '梦中的家',
    description: '你在废弃的沙发上睡着了。梦里没有爆炸声，只有温暖的壁炉和满碗的牛奶。',
    choices: [
      {
        text: '不愿醒来',
        effectDescription: '你在梦里流连忘返，醒来时感到巨大的失落和空虚。',
        statChanges: { mood: -10, stamina: 15 }
      },
      {
        text: '抖擞精神',
        effectDescription: '美好的梦给了你希望。为了再次拥有那个家，你要活下去。',
        statChanges: { mood: 10, stamina: 15, dignity: 5 }
      }
    ]
  }
];