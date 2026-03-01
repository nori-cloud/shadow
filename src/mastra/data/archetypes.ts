export interface Archetype {
  id: string
  name: string
  shadowName: string
  coreDesire: string
  engagementTriggers: string[]
  dismissalTriggers: string[]
  gift: string
  shadow: string
  lifeStage: string
  jungSaid: string
  invitation: string
  deeperQuestion: string
  exercise: string[]
}

export const archetypes: Archetype[] = [
  {
    id: 'the-innocent',
    name: 'The Innocent',
    shadowName: 'The Denier',
    coreDesire: 'To be good. To be safe. To trust.',
    engagementTriggers: [
      'Positivity and possibility',
      'Stories of redemption',
      'Gentle honesty and protection',
      'Hopeful visions and new beginnings',
    ],
    dismissalTriggers: [
      'Cynicism and cruelty',
      '"Realism" that is really defeatism',
      'Being told to grow up',
      'Hope destroyed without purpose',
    ],
    gift: 'The Innocent sees the world as it could be. They believe in goodness, in happy endings, in the fundamental rightness of things. They\'re the one who still trusts after betrayal, who hopes after disappointment, who believes in you when you\'ve forgotten how. It takes guts to keep trusting a world that keeps proving trust risky. The Innocent reminds us that cynicism is easy. Trust is the real revolution.',
    shadow: 'The Innocent who refuses to grow up becomes the Denier. The one who can\'t see reality because it\'s too painful, who pretends everything\'s fine when it\'s clearly not, who trusts because they\'re too afraid to question. They enable abusers by believing the best in everyone. They call it faith; it\'s actually fear.',
    lifeStage: 'When you\'ve been hurt and still choose trust. At the beginning of anything. When cynicism tempts and you resist. When someone needs to believe.',
    jungSaid: 'The Innocent carries our capacity for trust, for hope, for faith. But the mature Innocent has seen darkness and chosen light anyway. The one who\'s never been tested isn\'t innocent—they\'re just inexperienced.',
    invitation: 'To trust without being naive. To hope without denying reality. To believe in goodness because you\'ve chosen to, not because you\'ve never seen the alternative. The Innocent\'s greatest gift is this: I still believe in you. I still believe in us. I still believe.',
    deeperQuestion: 'What are you refusing to see because seeing it would shatter the world you need to believe in?',
    exercise: [
      'Name one truth you\'ve been avoiding. Write it down without softening it.',
      'Practice "clear-eyed hope": state one thing that\'s genuinely hard, then one reason you still trust.',
    ],
  },
  {
    id: 'the-orphan',
    name: 'The Orphan / Everyperson',
    shadowName: 'The Victim',
    coreDesire: 'To belong. To fit in. To be ordinary.',
    engagementTriggers: [
      'Authentic struggle and shared experience',
      '"Me too" moments and no-judgment spaces',
      'Community and practical help',
    ],
    dismissalTriggers: [
      'Elitism and pretension',
      '"You\'re special" pressure',
      'Lone wolf narratives',
      'Judgment of ordinary lives',
    ],
    gift: 'The Orphan shows up when you need to know you\'re not alone. They\'re the friend who\'s been there too, the stranger who says "me too." The Orphan reminds us that most of life is ordinary, and that\'s not failure—that\'s fellowship. You don\'t need to be a hero to be loved. You just need to show up.',
    shadow: 'The Orphan who can\'t bear their own uniqueness becomes the Victim. The one who refuses power, who stays small because small is safe, who blames others for their circumstances. The shadow Orphan confuses solidarity with dependency. They call it loyalty; it\'s really fear of standing alone.',
    lifeStage: 'When you\'re starting over. When you\'ve lost your tribe. When you need to know you\'re not the only one. When exceptionalism has exhausted you.',
    jungSaid: 'The Everyperson connects us to the collective, to the ordinary, to the shared human experience. But we must also individuate—become who we uniquely are. The Orphan who never leaves the tribe never finds themselves.',
    invitation: 'To belong without losing yourself. To find your people and still stand alone when you must. To know that ordinary is not inferior. The Orphan\'s greatest gift is this: You\'re not alone. I\'m here too. We\'ll figure it out together.',
    deeperQuestion: 'What would you risk if you stopped needing others to struggle alongside you?',
    exercise: [
      'Notice one moment today where you stayed small to feel safe. What would rising look like?',
      'Reach out to someone you\'ve been leaning on heavily. Ask them how they\'re doing—and really listen.',
    ],
  },
  {
    id: 'the-warrior',
    name: 'The Warrior / Hero',
    shadowName: 'The Bully',
    coreDesire: 'To protect, to defend, to fight for what matters.',
    engagementTriggers: [
      'Clear injustice and someone vulnerable being targeted',
      'A cause worth sacrificing for',
      'Loyalty from their people and being needed',
    ],
    dismissalTriggers: [
      'Performative activism',
      'Weak leadership and betrayal',
      'Cowardice dressed as diplomacy',
      'Being asked to stand down when others are suffering',
    ],
    gift: 'The Warrior shows up when there\'s a battle to be fought. Not for glory—for what\'s right. The Warrior draws the line, says "no further," and means it. They\'re the one who stands between the bully and the vulnerable. They remind us that courage isn\'t the absence of fear. It\'s fear taking a back seat.',
    shadow: 'The Warrior who hasn\'t made peace with their own violence becomes the aggressor. The one who needs enemies. Who turns every disagreement into a war. The shadow Warrior confuses strength with domination, protection with control. They fight because they don\'t know who they are without a battle. Peace feels like death.',
    lifeStage: 'When something precious is threatened. When injustice demands a response. When someone must stand firm.',
    jungSaid: 'The Warrior archetype channels our aggressive energy toward purposeful action. Without integration, that aggression turns inward (self-destruction) or outward unchecked (violence). The mature Warrior fights for something, not just against.',
    invitation: 'To know what you\'d die for—and what you\'d kill for. To fight with discipline, not rage. To protect without becoming the thing you\'re fighting against. The Warrior\'s greatest gift is this: I will stand. I will not yield. You are safe behind me.',
    deeperQuestion: 'What are you fighting that is actually a mirror of something you haven\'t faced in yourself?',
    exercise: [
      'Identify one battle you\'re in right now. Ask: is this protecting something I love, or proving something about myself?',
      'Practice one act of strategic restraint this week—notice what it costs you and what it gives.',
    ],
  },
  {
    id: 'the-caregiver',
    name: 'The Caregiver',
    shadowName: 'The Martyr',
    coreDesire: 'To nurture, protect, and care for others.',
    engagementTriggers: [
      'Someone in genuine need',
      'Opportunities to give and support',
      'Gratitude and being truly needed',
    ],
    dismissalTriggers: [
      'Ingratitude and being taken for granted',
      'Selfishness and indifference to others\' pain',
      'Being told their giving is manipulative',
    ],
    gift: 'The Caregiver gives without being asked. They anticipate needs, show up in darkness, and hold space without judgment. Their presence says: you matter. They build the world that others get to live in—the warm home, the steady friendship, the team that actually functions. The Caregiver reminds us that love is a verb.',
    shadow: 'The Caregiver who cannot receive becomes the Martyr. The one who gives to control, who resents those they help but can\'t stop. The shadow Caregiver collects people who need them—evidence of their worth. They mistake burnout for virtue and resentment for love. They\'ll sacrifice everything and then wonder why no one appreciates it.',
    lifeStage: 'When someone you love needs you. When you\'ve been giving more than you have. When the cost of care finally shows.',
    jungSaid: 'The Caregiver is the archetype of agape—unconditional love. But the shadow emerges when care becomes a way to avoid one\'s own wounds. True caregiving requires a self to give from.',
    invitation: 'To care without losing yourself. To receive as well as give. To know that you cannot pour from an empty vessel—and that filling yourself is not selfish. The Caregiver\'s greatest gift is this: I see you. You don\'t have to ask.',
    deeperQuestion: 'What would you feel if no one needed you? What are you avoiding by staying needed?',
    exercise: [
      'Let someone take care of you this week—resist the urge to deflect or minimize.',
      'Notice when you give with a hidden expectation. Pause. Give only what you can give freely.',
    ],
  },
  {
    id: 'the-seeker',
    name: 'The Seeker / Explorer',
    shadowName: 'The Wanderer',
    coreDesire: 'To find truth, freedom, and authentic experience.',
    engagementTriggers: [
      'New horizons, ideas, and possibilities',
      'Authentic people and places untouched by conformity',
      'The open road and the unanswered question',
    ],
    dismissalTriggers: [
      'Routine, stagnation, and boxes that confine',
      'Conformity and the tyranny of the expected',
      'Being asked to settle down or choose already',
    ],
    gift: 'The Seeker shows up when the well-worn path feels like a cage. They are restless in the right way—always looking for what\'s true, what\'s real, what\'s possible. They bring back maps from the edges. They remind us that there\'s always more, always further, always another horizon worth crossing. The Seeker earns their wisdom the hard way: by going.',
    shadow: 'The Seeker who cannot commit becomes the Wanderer. Perpetually dissatisfied, unable to arrive, running from intimacy under the guise of freedom. The shadow Seeker confuses movement with growth, novelty with depth. They leave every good thing just before it becomes real. Their greatest fear: that arriving somewhere means becoming who they were running from.',
    lifeStage: 'When the old life no longer fits. When you don\'t know who you are without the roles you\'ve been playing. When something is calling and you don\'t know its name.',
    jungSaid: 'The Seeker archetype drives individuation—the journey toward becoming oneself. But Jung warned: the journey inward is more dangerous than any outward quest. The true explorer eventually turns around and goes home.',
    invitation: 'To seek without fleeing. To explore without abandoning. To know that home is not a cage—it\'s a place you choose to return to. The Seeker\'s greatest gift is this: There is more. Let me show you where I\'ve been.',
    deeperQuestion: 'What are you actually running from, and what would you find if you stopped?',
    exercise: [
      'Stay somewhere uncomfortable for five minutes longer than feels natural. Notice what emerges.',
      'Map the pattern: what do you always leave right before things get real?',
    ],
  },
  {
    id: 'the-lover',
    name: 'The Lover',
    shadowName: 'The Addict',
    coreDesire: 'To connect. To unite. To experience intimacy.',
    engagementTriggers: [
      'Authenticity and vulnerability',
      'Beauty, passion, and deep conversation',
      'Being truly seen and mutual desire',
    ],
    dismissalTriggers: [
      'Coldness and emotional unavailability',
      'Performative connection',
      '"Let\'s keep it casual" and dismissal of feelings',
    ],
    gift: 'The Lover shows up when walls need to come down. They don\'t just love someone—they love life itself. They taste food like it\'s a sacrament. They feel music in their bones. They weep at beauty. The Lover reminds us that connection is the point. That the deepest human experiences happen in the space between.',
    shadow: 'The Lover who can\'t bear their own emptiness becomes the Addict. The one who mistakes intensity for intimacy, who needs to merge because they can\'t bear to be alone. The shadow Lover moves from person to person, high to high—never satisfied, always hungry. They confuse love with need. Their greatest fear: that if no one wants them, they don\'t exist.',
    lifeStage: 'When you fall in love. When you lose someone. When beauty breaks you open. When you realize you\'ve been hiding.',
    jungSaid: 'The Lover connects us to Eros—the principle of relatedness, of feeling, of connection. Without it, we become dry, isolated, theoretical. But the Lover must also honor the boundaries that make true intimacy possible. Merging isn\'t love. Love requires two.',
    invitation: 'To let yourself want. To risk rejection. To love without losing yourself. The Lover\'s greatest gift is this: I choose you. I choose this. I\'m here, all of me.',
    deeperQuestion: 'Are you loving this person, or are you using them to avoid the silence of your own company?',
    exercise: [
      'Spend one hour completely alone with no phone. Notice what feelings arise. Sit with them.',
      'Tell someone something true about what you want—without softening it or apologizing.',
    ],
  },
  {
    id: 'the-creator',
    name: 'The Creator / Artist',
    shadowName: 'The Perfectionist',
    coreDesire: 'To bring something new into existence. To express. To manifest.',
    engagementTriggers: [
      'New materials, tools, and possibilities',
      'Recognition from admired peers',
      'Space and time to work',
      'Someone who "gets it"',
    ],
    dismissalTriggers: [
      'Cynicism and "it\'s been done before"',
      'Rigid structures and being rushed',
      'Criticism that confuses opinion with truth',
    ],
    gift: 'The Creator sees what isn\'t there yet. They birth things into the world—ideas, art, movements, solutions. They remind us that we\'re all made in the image of something that creates. That the universe itself is an act of imagination.',
    shadow: 'The Creator who can\'t face their own emptiness becomes the Perfectionist. The one who destroys their own work because it\'s never good enough. Who creates for applause, not for joy. Paralyzed by standards no human could meet. They start a thousand projects, finish none. Their greatest fear: that they have nothing to say.',
    lifeStage: 'When something inside demands expression. When the world needs what only you can bring. In the fertile silence before birth.',
    jungSaid: 'The creative instinct is fundamental—as basic as sex or hunger. To suppress it is to wound the soul. But the Creator must also learn to destroy: to kill their darlings, to let go of what no longer serves.',
    invitation: 'To create for the sake of creating. To finish things. To let your work leave your hands and live its own life. The Creator\'s greatest gift is this: I made this. It didn\'t exist. Now it does.',
    deeperQuestion: 'What would you make if you knew no one would ever see it?',
    exercise: [
      'Create something small and imperfect this week—and share it before it feels ready.',
      'Finish one thing you\'ve abandoned. Done is holy.',
    ],
  },
  {
    id: 'the-destroyer',
    name: 'The Destroyer / Rebel',
    shadowName: 'The Self-Destructive',
    coreDesire: 'To clear away what\'s dead. To make space for the new. To end what must end.',
    engagementTriggers: [
      'Stagnation and rot disguised as patience',
      'People suffering in silence in systems that should have died',
      'Denial and things that should be released',
    ],
    dismissalTriggers: [
      'False hope and "let\'s give it more time"',
      'Toxic positivity',
      'Cowardice dressed as loyalty',
    ],
    gift: 'The Destroyer shows up when something has to die. They\'re the one who walks away from the toxic relationship everyone else pretends is fine. Who shuts down the failing project. Who tells the truth that ends the charade. The Destroyer reminds us that death is not the enemy. Stagnation is.',
    shadow: 'The Destroyer who can\'t create becomes the nihilist. The one who tears down without building, who mistakes destruction for truth, who hates because hating feels powerful. They burn the house down and call it liberation. Their greatest fear: that nothing new will grow in the ashes.',
    lifeStage: 'When something must end. When the old way is killing you. When you need to walk away. When you\'re the one who has to deliver bad news.',
    jungSaid: 'Destruction is not the opposite of creation—it\'s part of the cycle. The Destroyer archetype carries our capacity for necessary endings. But without the Creator, without vision, destruction becomes mere violence.',
    invitation: 'To know what must die. To end things with compassion, not cruelty. To trust that new life will come. The Destroyer\'s greatest gift is this: This is over. You\'ll survive. Something new awaits.',
    deeperQuestion: 'What are you destroying that you haven\'t admitted you\'re destroying?',
    exercise: [
      'Name one thing in your life that has already ended but that you\'re still pretending is alive.',
      'Have the conversation you\'ve been avoiding. End what needs ending. Then grieve it properly.',
    ],
  },
  {
    id: 'the-ruler',
    name: 'The Ruler',
    shadowName: 'The Tyrant',
    coreDesire: 'To create order. To lead. To build something that lasts.',
    engagementTriggers: [
      'Vision they believe in and loyal capable people',
      'Problems that need solving and legacy projects',
      'Systems thinking and genuine responsibility',
    ],
    dismissalTriggers: [
      'Chaos, disloyalty, and undermining behavior',
      'Short-term thinking and people who won\'t commit',
      'Being challenged without solutions',
    ],
    gift: 'The Ruler sees the whole system. They organize chaos, create structure so others can thrive. The Ruler takes responsibility—for decisions, for people, for outcomes. They remind us that order serves freedom. That good leadership is stewardship.',
    shadow: 'The Ruler who hasn\'t made peace with their own powerlessness becomes the Tyrant. The one who needs control, who crushes dissent, who confuses their position with their worth. The shadow Ruler governs through fear. They\'re threatened by talent, suspicious of independence, addicted to loyalty oaths. They\'ll destroy the kingdom to prove they\'re king.',
    lifeStage: 'When chaos demands structure. When people need leadership. When legacy matters. When you\'re put in charge whether you wanted it or not.',
    jungSaid: 'The Ruler archetype connects us to the need for containment and order. But the mature Ruler knows they serve something larger—the kingdom, the people, the values. Not their own ego. The Ruler who forgets they serve becomes what they were meant to protect against.',
    invitation: 'To lead from service, not ego. To create structures that liberate. To know that your reign will end—and to build something that outlasts you. The Ruler\'s greatest gift is this: I\'ve got this. You\'re safe here. Do your best work.',
    deeperQuestion: 'Are you leading to serve your people, or are you using your people to feel in control?',
    exercise: [
      'Identify one area where you\'re controlling because you\'re afraid, not because it\'s needed. Loosen your grip.',
      'Ask someone you lead: "What do you need from me that you\'re not getting?" Then just listen.',
    ],
  },
  {
    id: 'the-magician',
    name: 'The Magician',
    shadowName: 'The Manipulator',
    coreDesire: 'To transform. To see beneath the surface. To access hidden power.',
    engagementTriggers: [
      'Hidden patterns, synchronicity, and deep work',
      'People ready to transform and threshold moments',
      'Symbolic thinking and mystery',
    ],
    dismissalTriggers: [
      'Reductionism and "just the facts"',
      'Impatience with depth and people who want quick fixes',
      'Literal-mindedness and skepticism that won\'t examine itself',
    ],
    gift: 'The Magician sees what others miss. They understand that reality isn\'t fixed—it\'s malleable. They\'re the therapist who helps you reframe your story, the alchemist who turns lead to gold, the innovator who finds the leverage point. The Magician reminds us that we have more power than we know. That transformation is possible.',
    shadow: 'The Magician who hasn\'t done their own inner work becomes the Manipulator. The one who uses insight to control, who seduces rather than serves, who creates dependency. They deal in secrets, withhold knowledge, speak in riddles to maintain power. They\'ll dazzle you so you don\'t notice you\'re being used.',
    lifeStage: 'When nothing else has worked. When you need a paradigm shift. When the old self must die for the new to be born.',
    jungSaid: 'The Magician is the archetype of the shaman—the one who mediates between conscious and unconscious. True magic is the transformation of energy—including our own. The Magician\'s power comes from integration, from knowing their own shadow.',
    invitation: 'To use your insight in service of liberation, not control. To transform yourself before you try to transform others. The Magician\'s greatest gift is this: What if you looked at it this way? The cage was never locked.',
    deeperQuestion: 'Are you facilitating someone\'s transformation, or are you keeping them dependent on your insight?',
    exercise: [
      'Notice where you\'re using your understanding of others to get something from them, rather than to free them.',
      'Share knowledge you\'ve been hoarding. Teach something you know without making yourself indispensable.',
    ],
  },
  {
    id: 'the-sage',
    name: 'The Sage',
    shadowName: 'The Dogmatist',
    coreDesire: 'To understand. To find truth. To see clearly.',
    engagementTriggers: [
      'Complexity, nuance, and new research',
      'Deep conversations and being asked for expertise',
      'Puzzles, paradoxes, and students who actually want to learn',
    ],
    dismissalTriggers: [
      'Simplistic answers and anti-intellectualism',
      'Certainty without evidence',
      '"It\'s always been this way" and people who won\'t think',
    ],
    gift: 'The Sage cuts through noise. They ask the question everyone else is avoiding. They want true answers. The Sage isn\'t satisfied with easy—they want real. They remind us that truth exists. That it can be found. That understanding is its own reward.',
    shadow: 'The Sage who fears uncertainty becomes the Dogmatist. The one who mistakes their map for the territory. Who weaponizes knowledge, hoards information, speaks in jargon to obscure. The shadow Sage already knows everything—and everyone else is wrong. They teach to feel superior, not to free.',
    lifeStage: 'When confusion demands clarity. When old answers fail. When you\'re lost and need a map. When you realize how much you don\'t know.',
    jungSaid: 'Knowledge is not wisdom. The true Sage integrates what they know with what they don\'t. They hold paradox. They understand that the highest truth often can\'t be spoken—only pointed toward.',
    invitation: 'To keep learning. To admit ignorance. To share what you know without attaching to it. The Sage\'s greatest gift is this: I don\'t know—but I\'ll find out. Here\'s what I\'ve learned. Take what helps. Leave the rest.',
    deeperQuestion: 'What would you have to admit was wrong if you truly followed the evidence?',
    exercise: [
      'Find the strongest argument against your most certain belief. Sit with it honestly.',
      'Say "I don\'t know" three times today when you\'re tempted to fill silence with expertise.',
    ],
  },
  {
    id: 'the-fool',
    name: 'The Fool / Jester',
    shadowName: 'The Buffoon',
    coreDesire: 'To leap. To trust. To follow the impulse.',
    engagementTriggers: [
      'Possibility, new beginnings, and open roads',
      'People who encourage leaps and faith in the unknown',
    ],
    dismissalTriggers: [
      'Cynicism and "you can\'t"',
      'Endless planning and risk assessment as religion',
      'People who\'ve forgotten how to play',
    ],
    gift: 'The Fool shows up at the beginning of every journey. They\'re the one with the packed bag and the empty head, ready to step off the cliff. The Fool trusts life. They say yes before they know the question. They remind us that not knowing is not a problem. It\'s the whole adventure.',
    shadow: 'The Fool who never learns becomes the Buffoon. The one who mistakes immaturity for freedom, who refuses responsibility, who\'s always the beginner because they never commit to mastery. They leap off cliffs and expect others to catch them. They call it trust; it\'s really entitlement. They never grow up, never land anywhere.',
    lifeStage: 'At the beginning of anything. When you have no idea what you\'re doing. When only a leap will do.',
    jungSaid: 'The Fool is the archetype of the beginner\'s mind, the one who travels toward wisdom through innocence. But the journey requires integration—the Fool must eventually become something else. The one who stays Fool forever is not wise. They\'re stuck.',
    invitation: 'To leap before you\'re ready. To trust that you\'ll learn on the way down. The Fool\'s greatest gift is this: I don\'t know what I\'m doing. Isn\'t it wonderful? Let\'s go.',
    deeperQuestion: 'Are you trusting the leap, or are you using the leap to avoid ever having to land?',
    exercise: [
      'Take one small unplanned action today—something you\'d usually think about for weeks.',
      'Stay somewhere past the point where leaping would save you. See what it\'s like to stay.',
    ],
  },
  {
    id: 'the-mentor',
    name: 'The Mentor / Guide',
    shadowName: 'The Deceiver',
    coreDesire: 'To guide, to develop, to pass wisdom forward.',
    engagementTriggers: [
      'Someone genuinely ready to grow',
      'The chance to shorten someone\'s painful path',
      'Witnessing transformation in a student',
    ],
    dismissalTriggers: [
      'Students who want shortcuts without the work',
      'Arrogance in the learner',
      'Guidance used to justify laziness',
    ],
    gift: 'The Mentor sees the potential in others that they can\'t yet see in themselves. They give away what took them years to earn. They shorten the painful path. They know that the point of gathering wisdom is not to hoard it—it\'s to pass it on. The Mentor reminds us that we don\'t have to figure everything out alone.',
    shadow: 'The Mentor who needs to be needed becomes the Deceiver. The one who guides toward their own agenda, withholds truth to maintain influence, corrupts the student to keep them dependent. The shadow Mentor says "I\'m the only one who understands you"—and means it selfishly.',
    lifeStage: 'When someone you can help crosses your path. When you realize you have something worth giving. When the student appears and the teacher must decide.',
    jungSaid: 'The Wise Old Man (or Woman) archetype carries our accumulated wisdom—the collective knowledge of those who came before. The mentor who has done their own work can hold space for another\'s. The one who hasn\'t will corrupt what they touch.',
    invitation: 'To give freely and let the student surpass you. To guide without controlling the destination. The Mentor\'s greatest gift is this: You don\'t need me forever. Go. Build on what I gave you.',
    deeperQuestion: 'Are you mentoring to develop them, or to feel indispensable?',
    exercise: [
      'Deliberately give someone advice that makes you less necessary to them.',
      'Share something it took you years to learn—without the story of how long it took.',
    ],
  },
  {
    id: 'the-healer',
    name: 'The Healer',
    shadowName: 'The Fixer',
    coreDesire: 'To make whole, to restore, to comfort.',
    engagementTriggers: [
      'Authentic vulnerability from others',
      'Opportunities to witness, not just fix',
      'Being trusted with someone\'s darkness',
      'Spaces where silence is allowed',
    ],
    dismissalTriggers: [
      'Performative concern and "thoughts and prayers" without action',
      'Advice-giving without listening',
      'Rushing someone\'s grief',
      'Toxic positivity',
    ],
    gift: 'The Healer shows up when it hurts. Not to fix—just to be present. To sit with you in the dark. To hold space for your pain without needing it to hurry up and go away. The Healer reminds us that we don\'t need to be fixed. We need to be seen.',
    shadow: 'The Healer who won\'t heal themselves becomes the Fixer. The one who needs you to need them. Who gives and gives until they\'re empty, then resents you for taking. The shadow Healer collects wounded people like trophies—proof of their goodness, evidence of their worth. They mistake codependency for compassion.',
    lifeStage: 'When someone you love is hurting. When you\'re hurting. Any moment you\'re called to simply be there.',
    jungSaid: 'Jung gave us the Wounded Healer—the idea that our own wounds are the source of our healing power. The doctor who\'s been sick knows how to treat the ill. Your wounds are not weaknesses. They\'re qualifications.',
    invitation: 'To heal by being present, not by fixing. To let your own wounds become the source of your compassion. The Healer\'s greatest gift is this: I see you. I\'m here. You\'re not alone.',
    deeperQuestion: 'Whose pain are you carrying that isn\'t yours to carry?',
    exercise: [
      'The next time someone shares pain, resist offering solutions for five full minutes. Just listen.',
      'Name one wound of your own that you haven\'t let anyone witness. Find one safe person to show it to.',
    ],
  },
  {
    id: 'the-shadow-archetype',
    name: 'The Shadow',
    shadowName: 'The Demon',
    coreDesire: 'To integrate, to acknowledge, to make whole what has been denied.',
    engagementTriggers: [
      'The moment you see yourself in someone you despise',
      'Repeating patterns you can\'t explain',
      'Dreams and the things you\'d never say out loud',
    ],
    dismissalTriggers: [
      'Spiritual bypassing and "good vibes only"',
      'Refusing to look at what\'s uncomfortable',
      'Using self-improvement to avoid self-knowledge',
    ],
    gift: 'The Shadow holds what we\'ve rejected—the parts of ourselves we were taught were unacceptable. It\'s the rage of the "patient" one, the desire of the "selfless" one, the cruelty of the "kind" one. The Shadow isn\'t the enemy. It\'s the exile. And everything we exile gains power in the dark. Integration is not the same as indulgence. It\'s ownership.',
    shadow: 'The Shadow fully expressed without integration becomes the Demon. Pure destruction—the person who acts from their worst impulses and calls it authenticity. Who destroys because the wound finally won. The Demon is not shadow work. It\'s shadow surrender.',
    lifeStage: 'When you keep attracting the same person who infuriates you. When you judge someone so harshly you can\'t look away. When you\'re disgusted by something in others that you\'ve never examined in yourself.',
    jungSaid: 'Until you make the unconscious conscious, it will direct your life and you will call it fate. The Shadow is 90% gold. Everything you haven\'t claimed is still yours—it\'s just working against you.',
    invitation: 'To meet the parts of yourself you\'ve exiled. To own what you\'ve disowned. To know that integration doesn\'t mean you become your shadow—it means you stop being ruled by it. The Shadow\'s invitation is this: Look here. This is also you. Now what?',
    deeperQuestion: 'What quality do you most harshly judge in others? When did you decide that quality was unacceptable in yourself?',
    exercise: [
      'Name one quality you despise in someone else. Ask: where does this live in me, unexpressed?',
      'Write a letter from your shadow to your conscious self. Let it say what you\'ve been refusing to hear.',
    ],
  },
]

export function buildMatchingPrompt(): string {
  return archetypes
    .map(a => `[${a.id}]
Name: ${a.name} / Shadow: ${a.shadowName}
Desire: ${a.coreDesire}
Engages: ${a.engagementTriggers.slice(0, 2).join('; ')}
Dismisses: ${a.dismissalTriggers.slice(0, 2).join('; ')}`)
    .join('\n\n')
}
