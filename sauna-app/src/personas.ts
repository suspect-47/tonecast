export type PersonaId =
  | "movie_trailer"
  | "furious_chef"
  | "ancient_wizard"
  | "pirate_captain"
  | "sports_commentator"
  | "noir_detective"
  | "shakespearean_bard"
  | "gen_z_hype"
  | "zen_master"
  | "standup_genx"
  | "standup_geny"
  | "standup_genz";

export type Animation = "glow" | "shake" | "smoke" | "wave" | "pulse";

export type PersonaConfig = {
  id: PersonaId;
  label: string;
  description: string;
  uiTheme: string;
  sendLabel: string;
  animation: Animation;
  // ElevenLabs voices: default (persona flavor) + a male and female cast so the
  // "Voice" toggle keeps each persona distinct (a male Gen Z != a male Gen X).
  voiceId: string;
  maleVoiceId: string;
  femaleVoiceId: string;
};

export const personas: PersonaConfig[] = [
  {
    id: "movie_trailer",
    label: "Movie Trailer",
    description: "Treats routine messages like world-changing cinema.",
    uiTheme: "trailer-fire",
    sendLabel: "Release the Trailer",
    animation: "glow",
    voiceId: "AQ6yxtsTonfHLHY2zUcO", // Todd - deep, bold
    maleVoiceId: "AQ6yxtsTonfHLHY2zUcO", // Todd
    femaleVoiceId: "Pid5DJleNF2sxsuF6YKD", // Aneta Nova - confident
  },
  {
    id: "furious_chef",
    label: "Furious Chef",
    description: "High heat, sharp criticism, and dramatic seasoning.",
    uiTheme: "kitchen-heat",
    sendLabel: "Serve the Verdict",
    animation: "shake",
    voiceId: "SOYHLrjzK2X1ezoPC6cr", // Harry - rough
    maleVoiceId: "SOYHLrjzK2X1ezoPC6cr", // Harry
    femaleVoiceId: "FGY2WhTYpPnrIDTdsKH5", // Laura - sassy
  },
  {
    id: "ancient_wizard",
    label: "Ancient Wizard",
    description: "Transforms logistics into prophecy and ceremony.",
    uiTheme: "arcane-mist",
    sendLabel: "Deliver the Prophecy",
    animation: "smoke",
    voiceId: "JoYo65swyP8hH6fVMeTO", // Old Wizard
    maleVoiceId: "JoYo65swyP8hH6fVMeTO", // Old Wizard
    femaleVoiceId: "KHCvMklQZZo0O30ERnVn", // Sara Martin - wise
  },
  {
    id: "pirate_captain",
    label: "Pirate Captain",
    description: "Every message becomes a mutinous demand from the deck.",
    uiTheme: "storm-sea",
    sendLabel: "Send to the Seven Seas",
    animation: "wave",
    voiceId: "N2lVS1w4EtoT3dr4eOWO", // Callum - husky trickster
    maleVoiceId: "N2lVS1w4EtoT3dr4eOWO", // Callum
    femaleVoiceId: "Rpg8Sn3cVL1f8658yYm2", // Pauline - aussie character
  },
  {
    id: "sports_commentator",
    label: "Sports Commentator",
    description: "Office updates narrated like a championship final.",
    uiTheme: "arena-lights",
    sendLabel: "Broadcast the Play",
    animation: "pulse",
    voiceId: "TX3LPaxmHKxFdv7VOQHJ", // Liam - energetic
    maleVoiceId: "TX3LPaxmHKxFdv7VOQHJ", // Liam
    femaleVoiceId: "tnSpp4vdxKPjI9w0GnoV", // Hope - upbeat
  },
  {
    id: "noir_detective",
    label: "Noir Detective",
    description: "Rain-slicked monologue where every calendar invite hides a case.",
    uiTheme: "noir-shadow",
    sendLabel: "Close the Case",
    animation: "smoke",
    voiceId: "EkK5I93UQWFDigLMpZcX", // James - husky, deep
    maleVoiceId: "EkK5I93UQWFDigLMpZcX", // James
    femaleVoiceId: "SaqYcK3ZpDKBAImA8AdW", // Jane Doe - intimate
  },
  {
    id: "shakespearean_bard",
    label: "Shakespearean Bard",
    description: "Iambic grandeur for the pettiest of status updates.",
    uiTheme: "velvet-stage",
    sendLabel: "Perform the Verse",
    animation: "glow",
    voiceId: "JBFqnCBsd6RMkjVDRZzb", // George - british, warm
    maleVoiceId: "JBFqnCBsd6RMkjVDRZzb", // George
    femaleVoiceId: "Xb7hH8MSUJpSbSDYk0k2", // Alice - british
  },
  {
    id: "gen_z_hype",
    label: "Gen Z Hype",
    description: "Unhinged group-chat energy. It's giving corporate, but slay.",
    uiTheme: "neon-pop",
    sendLabel: "Post It fr fr",
    animation: "pulse",
    voiceId: "IKne3meq5aSn9XLyUdCD", // Charlie - hyped
    maleVoiceId: "IKne3meq5aSn9XLyUdCD", // Charlie
    femaleVoiceId: "jqcCZkN6Knx8BJ5TBdYR", // Zara - confident social
  },
  {
    id: "zen_master",
    label: "Zen Master",
    description: "Dissolves urgency into calm, breathing, unbothered clarity.",
    uiTheme: "still-water",
    sendLabel: "Release with Peace",
    animation: "wave",
    voiceId: "NFG5qt843uXKj4pFvR7C", // Adam Stone - meditative
    maleVoiceId: "NFG5qt843uXKj4pFvR7C", // Adam Stone
    femaleVoiceId: "iCrDUkL56s3C8sCRl7wb", // Hope - soothing
  },
  {
    id: "standup_genx",
    label: "Standup: Gen X",
    description: "Deadpan, cynical mic work — latchkey shrugs, 90s callbacks, whatever.",
    uiTheme: "grunge-club",
    sendLabel: "Drop the Set",
    animation: "pulse",
    voiceId: "CwhRBWXzGAHq8TQ4Fs17", // Roger - laid-back, middle-aged
    maleVoiceId: "CwhRBWXzGAHq8TQ4Fs17", // Roger
    femaleVoiceId: "56AoDkrOh6qfVPDXZ7Pt", // Cassidy - confident, middle-aged
  },
  {
    id: "standup_geny",
    label: "Standup: Millennial",
    description: "Self-deprecating burnout comedy — debt, adulting, and existential dread with a smile.",
    uiTheme: "open-mic",
    sendLabel: "Land the Bit",
    animation: "glow",
    voiceId: "bIHbv24MWmeRgasZH58o", // Will - young, relaxed optimist
    maleVoiceId: "bIHbv24MWmeRgasZH58o", // Will
    femaleVoiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah - young, reassuring
  },
  {
    id: "standup_genz",
    label: "Standup: Gen Z",
    description: "Absurdist, chronically-online deadpan — ironic, unbothered, lowercase energy.",
    uiTheme: "brainrot",
    sendLabel: "Send, no cap",
    animation: "shake",
    voiceId: "9F4C8ztpNUmXkdDDbz3J", // Dan Dan - young, excited
    maleVoiceId: "9F4C8ztpNUmXkdDDbz3J", // Dan Dan
    femaleVoiceId: "6u6JbqKdaQy89ENzLSju", // Brielle - young, chill podcast
  },
];

export const personaMap = new Map(personas.map((p) => [p.id, p]));

export function isPersonaId(value: string): value is PersonaId {
  return personaMap.has(value as PersonaId);
}
