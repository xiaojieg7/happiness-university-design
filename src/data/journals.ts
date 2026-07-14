// 期刊专栏数据 — 幸福设计与积极心理学领域精选期刊与文章

export interface JournalArticle {
  id: string
  title: string
  authors: string[]
  journal: string
  year: number
  volume?: string
  pages?: string
  doi?: string
  category: ArticleCategory
  abstract: string
  keywords: string[]
  url: string
  featured?: boolean
}

export type ArticleCategory =
  | 'positive-psychology'
  | 'happiness-studies'
  | 'design-wellbeing'
  | 'mindfulness'
  | 'social-relations'

export interface CategoryInfo {
  key: ArticleCategory
  label: string
  icon: string
  description: string
}

export const categories: CategoryInfo[] = [
  {
    key: 'positive-psychology',
    label: '积极心理学',
    icon: 'Sparkles',
    description: '关于人类 Flourishing 与心理韧性的科学研究',
  },
  {
    key: 'happiness-studies',
    label: '幸福学研究',
    icon: 'Heart',
    description: '主观幸福感、生活满意度与幸福测量',
  },
  {
    key: 'design-wellbeing',
    label: '设计与幸福',
    icon: 'Palette',
    description: '设计如何促进人类福祉与正向体验',
  },
  {
    key: 'mindfulness',
    label: '正念与心智',
    icon: 'Brain',
    description: '正念干预对幸福与心理健康的实证研究',
  },
  {
    key: 'social-relations',
    label: '社会关系',
    icon: 'Users',
    description: '人际关系、社会连接与社区幸福感',
  },
]

export const articles: JournalArticle[] = [
  // ========== 积极心理学 ==========
  {
    id: 'seligman-2011-perma',
    title: 'Flourish: A Visionary New Understanding of Happiness and Well-being',
    authors: ['Martin E. P. Seligman'],
    journal: 'American Psychologist',
    year: 2011,
    volume: '66(1)',
    pages: '9-10',
    doi: '10.1037/a0020516',
    category: 'positive-psychology',
    abstract:
      'Seligman 在本文中提出了 PERMA 模型，将幸福扩展为五个可测量的维度：积极情绪(P)、投入(E)、关系(R)、意义(M)和成就(A)。这一框架超越了传统的享乐主义幸福观，为积极心理学提供了系统的理论基石。',
    keywords: ['PERMA模型', 'Flourishing', '积极心理学', '幸福感测量'],
    url: 'https://doi.org/10.1037/a0020516',
    featured: true,
  },
  {
    id: 'fredrickson-2001-broaden',
    title: 'The Broaden-and-Build Theory of Positive Emotions',
    authors: ['Barbara L. Fredrickson'],
    journal: 'American Psychologist',
    year: 2001,
    volume: '56(3)',
    pages: '218-226',
    doi: '10.1037/0003-066X.56.3.218',
    category: 'positive-psychology',
    abstract:
      'Fredrickson 提出的"拓展-建构"理论认为，积极情绪能暂时拓宽人的思维-行动倾向，长期积累则建构持久的个人资源（认知、社会、身体）。该理论解释了为什么积极情绪不仅是"好的感受"，更是人类发展的引擎。',
    keywords: ['积极情绪', '拓展-建构理论', '心理资源', '认知拓宽'],
    url: 'https://doi.org/10.1037/0003-066X.56.3.218',
    featured: true,
  },
  {
    id: 'csikszentmihalyi-1997-flow',
    title: 'Finding Flow: The Psychology of Engagement with Everyday Life',
    authors: ['Mihaly Csikszentmihalyi'],
    journal: 'Basic Books',
    year: 1997,
    category: 'positive-psychology',
    abstract:
      '心流（Flow）是当个人完全投入某项活动时产生的一种最佳体验状态，特征包括注意力高度集中、行动与意识融合、自我意识消失以及时间感扭曲。心流体验频繁的人报告更高的生活满意度。',
    keywords: ['心流', '最佳体验', '投入', '技能-挑战平衡'],
    url: 'https://www.basicbooks.com',
  },
  {
    id: 'ryan-deci-2000-selfdetermination',
    title: 'Self-Determination Theory and the Facilitation of Intrinsic Motivation, Social Development, and Well-being',
    authors: ['Richard M. Ryan', 'Edward L. Deci'],
    journal: 'American Psychologist',
    year: 2000,
    volume: '55(1)',
    pages: '68-78',
    doi: '10.1037/0003-066X.55.1.68',
    category: 'positive-psychology',
    abstract:
      '自我决定理论（SDT）提出三个基本心理需求——自主性(autonomy)、胜任感(competence)和关联性(relatedness)——是促进内在动机和整体幸福感的必要条件。当环境支持这三个需求时，个体展现出更强的活力和成长。',
    keywords: ['自我决定理论', '内在动机', '基本心理需求', '自主性'],
    url: 'https://doi.org/10.1037/0003-066X.55.1.68',
  },

  // ========== 幸福学研究 ==========
  {
    id: 'diener-2000-subjective',
    title: 'Subjective Well-being: The Science of Happiness and a Proposal for a National Index',
    authors: ['Ed Diener'],
    journal: 'American Psychologist',
    year: 2000,
    volume: '55(1)',
    pages: '34-43',
    doi: '10.1037/0003-066X.55.1.34',
    category: 'happiness-studies',
    abstract:
      'Diener 系统综述了主观幸福感（SWB）的研究进展，提出幸福包含生活满意度和情感平衡两个维度。文章呼吁建立国家幸福指数，将主观幸福感纳入政策评估体系，超越单纯的经济指标。',
    keywords: ['主观幸福感', '生活满意度', '国家幸福指数', '幸福测量'],
    url: 'https://doi.org/10.1037/0003-066X.55.1.34',
    featured: true,
  },
  {
    id: 'easterlin-1974-paradox',
    title: 'Does Economic Growth Improve the Human Lot? Some Empirical Evidence',
    authors: ['Richard A. Easterlin'],
    journal: 'Nations and Households in Economic Growth',
    year: 1974,
    pages: '89-125',
    category: 'happiness-studies',
    abstract:
      'Easterlin 悖论揭示了收入与幸福之间的复杂关系：在某一时间点，富人比穷人更幸福；但长期来看，经济增长并不必然带来整体幸福感的提升。这一发现深刻影响了幸福经济学的发展。',
    keywords: ['Easterlin悖论', '幸福经济学', '收入与幸福', '相对收入'],
    url: 'https://link.springer.com/chapter/10.1007/978-1-4612-6607-9_11',
  },
  {
    id: 'layard-2006-happiness',
    title: 'Happiness: Lessons from a New Science',
    authors: ['Richard Layard'],
    journal: 'Penguin Books',
    year: 2006,
    category: 'happiness-studies',
    abstract:
      'Layard 整合了经济学、心理学和神经科学的研究，论证了幸福应成为公共政策的核心目标。书中指出影响幸福的七大因素——家庭关系、财务状况、工作、社区与朋友、健康、个人自由和个人价值观。',
    keywords: ['公共政策', '幸福科学', '社会幸福', '福利经济学'],
    url: 'https://www.penguin.com',
  },
  {
    id: 'helliwell-2023-worldhappiness',
    title: 'World Happiness Report 2023: The Happiness Agenda: The Next 10 Years',
    authors: ['John F. Helliwell', 'Richard Layard', 'Jeffrey D. Sachs', 'Jan-Emmanuel De Neve', 'Lara B. Aknin', 'Shun Wang'],
    journal: 'Sustainable Development Solutions Network',
    year: 2023,
    category: 'happiness-studies',
    abstract:
      '《世界幸福报告》使用盖洛普世界民意调查数据，基于GDP、社会支持、健康预期寿命、自由度、慷慨度和腐败感知六个变量对全球137个国家进行幸福排名。芬兰连续第六年位居榜首，报告强调信任与社会连接的关键作用。',
    keywords: ['世界幸福报告', '全球幸福排名', '社会支持', '信任'],
    url: 'https://worldhappiness.report/ed/2023/',
    featured: true,
  },

  // ========== 设计与幸福 ==========
  {
    id: 'desmet-2012-design',
    title: 'Faces of Product Pleasure: 25 Positive Emotions in Human-Product Interaction',
    authors: ['Pieter M. A. Desmet'],
    journal: 'International Journal of Design',
    year: 2012,
    volume: '6(2)',
    pages: '1-29',
    category: 'design-wellbeing',
    abstract:
      'Desmet 识别了人机产品交互中25种积极情绪，分为亲近、享受、惊奇和期望四类。该框架为"为幸福设计"提供了细粒度的情感设计工具，帮助设计师从情感层面创造有意义的用户体验。',
    keywords: ['情感设计', '积极情绪', '人机交互', '产品体验'],
    url: 'https://www.ijdesign.org',
    featured: true,
  },
  {
    id: 'norman-2004-emotional',
    title: 'Emotional Design: Why We Love (or Hate) Everyday Things',
    authors: ['Donald A. Norman'],
    journal: 'Basic Books',
    year: 2004,
    category: 'design-wellbeing',
    abstract:
      'Norman 提出情感设计的三个层次：本能层（外观）、行为层（可用性）和反思层（意义与自我形象）。好的设计需同时满足三个层次，才能创造深刻而持久的正面情感体验。',
    keywords: ['情感设计', '本能层', '行为层', '反思层', '用户体验'],
    url: 'https://www.basicbooks.com',
  },
  {
    id: 'hassenzahl-2010 Experience',
    title: 'Experience Design: Technology for All the Right Reasons',
    authors: ['Marc Hassenzahl'],
    journal: 'Morgan & Claypool',
    year: 2010,
    category: 'design-wellbeing',
    abstract:
      'Hassenzahl 提出以"体验"为核心的设计方法，区分了实用性(pragmatic)和享乐性(hedonic)品质。享乐品质包括刺激、能力和身份三个维度，对用户的幸福感和长期使用意愿有重要影响。',
    keywords: ['体验设计', '享乐品质', '实用性品质', '技术接受'],
    url: 'https://www.morganclaypool.com',
  },
  {
    id: 'pohlmeyer-2013-design4wellbeing',
    title: 'Positive Design: New Opportunities for Designing for Human Flourishing',
    authors: ['Anna E. Pohlmeyer', 'Pieter M. A. Desmet'],
    journal: 'Journal of Design Research',
    year: 2013,
    category: 'design-wellbeing',
    abstract:
      'Pohlmeyer 和 Desmet 提出了"积极设计"框架，将积极心理学的 Flourishing 概念引入设计实践。该框架包含三个设计目标——愉悦体验、个人意义和美德成长——以及相应的设计策略与评估方法。',
    keywords: ['积极设计', 'Flourishing', '设计幸福', '美德成长'],
    url: 'https://www.inderscience.com',
    featured: true,
  },

  // ========== 正念与心智 ==========
  {
    id: 'kabat-zinn-2003-mbsr',
    title: 'Mindfulness-based Interventions in Context: Past, Present, and Future',
    authors: ['Jon Kabat-Zinn'],
    journal: 'Clinical Psychology: Science and Practice',
    year: 2003,
    volume: '10(2)',
    pages: '144-156',
    doi: '10.1093/clipsy.bpg016',
    category: 'mindfulness',
    abstract:
      'Kabat-Zinn 回顾了正念减压（MBSR）项目的发展历程，将正念定义为"有意识地、不评判地将注意力集中于当下的体验"。研究表明 MBSR 对焦虑、抑郁、慢性疼痛和压力管理均有显著效果。',
    keywords: ['正念', 'MBSR', '压力管理', '心理健康干预'],
    url: 'https://doi.org/10.1093/clipsy.bpg016',
    featured: true,
  },
  {
    id: 'brown-2003-mindfulness',
    title: 'The Benefits of Being Present: Mindfulness and Its Role in Psychological Well-being',
    authors: ['Kirk Warren Brown', 'Richard M. Ryan'],
    journal: 'Journal of Personality and Social Psychology',
    year: 2003,
    volume: '84(4)',
    pages: '822-848',
    doi: '10.1037/0022-3514.84.4.822',
    category: 'mindfulness',
    abstract:
      'Brown 和 Ryan 开发了正念注意觉察量表（MAAS），发现正念特质与更高的生活满意度、自主性和胜任感相关，与较少的负性情绪和反刍思维相关。研究证明了"活在当下"对心理幸福的根本性贡献。',
    keywords: ['正念', 'MAAS', '当下觉察', '心理幸福感'],
    url: 'https://doi.org/10.1037/0022-3514.84.4.822',
  },
  {
    id: 'goleman-2017-altered',
    title: 'Altered Traits: Science Reveals How Meditation Changes Your Mind, Brain, and Body',
    authors: ['Daniel Goleman', 'Richard J. Davidson'],
    journal: 'Avery Publishing',
    year: 2017,
    category: 'mindfulness',
    abstract:
      'Goleman 和 Davidson 审视了数十年冥想科学研究，区分了"改变的状态"（暂时的冥想体验）和"改变的特质"（持久的心理品质变化）。长期冥想者在注意力、情绪调节和同理心方面展现出稳定的大脑可塑性变化。',
    keywords: ['冥想', '神经可塑性', '情绪调节', '同理心'],
    url: 'https://www.penguinrandomhouse.com',
  },

  // ========== 社会关系 ==========
  {
    id: 'waldinger-2015-harvard',
    title: 'The Harvard Study of Adult Development: 75 Years of Old Lessons for Living a Good Life',
    authors: ['Robert Waldinger'],
    journal: 'TED Talk & Harvard Study Archives',
    year: 2015,
    category: 'social-relations',
    abstract:
      '哈佛成人发展研究是人类历史上最长的人类生活追踪研究（始于1938年，持续85年）。核心发现：良好的人际关系是幸福和健康的最强预测因素——比财富、名声或社会阶层更重要。孤独对健康的危害等同于每天吸15支烟。',
    keywords: ['哈佛幸福研究', '人际关系', '长寿', '社会连接'],
    url: 'https://www.ted.com/talks/robert_waldinger',
    featured: true,
  },
  {
    id: 'holt-lunstad-2010-social',
    title: 'Social Relationships and Mortality Risk: A Meta-analytic Review',
    authors: ['Julianne Holt-Lunstad', 'Timothy B. Smith', 'J. Bradley Layton'],
    journal: 'PLoS Medicine',
    year: 2010,
    volume: '7(7)',
    doi: '10.1371/journal.pmed.1000316',
    category: 'social-relations',
    abstract:
      '这项元分析综合了148项研究、覆盖30.8万参与者，发现强社会关系使死亡风险降低50%。社会连接对存活率的影响超过了吸烟、饮酒和肥胖等已知健康风险因素，确立了社会关系作为公共卫生优先议题的地位。',
    keywords: ['社会关系', '死亡率', '元分析', '公共健康'],
    url: 'https://doi.org/10.1371/journal.pmed.1000316',
  },
  {
    id: 'lyubomirsky-2005-happiness',
    title: 'Pursuing Happiness: The Architecture of Sustainable Change',
    authors: ['Sonja Lyubomirsky', 'Kennon M. Sheldon', 'David Schkade'],
    journal: 'Review of General Psychology',
    year: 2005,
    volume: '9(2)',
    pages: '111-131',
    doi: '10.1037/1089-2680.9.2.111',
    category: 'social-relations',
    abstract:
      'Lyubomirsky 提出幸福公式：幸福 = 基因设定点(50%) + 环境(10%) + 有意活动(40%)。这意味着通过感恩、善意行为和积极思维等"幸福干预"，个体可以在很大程度上主动提升持久幸福感。文章提供了系统化的幸福增强策略。',
    keywords: ['幸福公式', '幸福干预', '感恩', '善意行为'],
    url: 'https://doi.org/10.1037/1089-2680.9.2.111',
    featured: true,
  },
]
