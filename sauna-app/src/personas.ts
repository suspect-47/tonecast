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
  // ElevenLabs voice used when performing this persona aloud.
  voiceId: string;
};

// Known Sauna workspace voices (see elevenlabs skill).
const VOICE = {
  saunaMain: "ys3XeJJA4ArWMhRpcX1D",
  david: "jvcMcno3QtjOzGtfpjoI",
  edward: "goT3UYdM9bhm0n2lmKQx",
  matthew: "8JVbfL6oEdmuxKn5DK2C",
} as const;

export const personas: PersonaConfig[] = [
  {
    id: "movie_trailer",
    label: "Movie Trailer",
    description: "Treats routine messages like world-changing cinema.",
    uiTheme: "trailer-fire",
    sendLabel: "Release the Trailer",
    animation: "glow",
    voiceId: VOICE.david,
  },
  {
    id: "furious_chef",
    label: "Furious Chef",
    description: "High heat, sharp criticism, and dramatic seasoning.",
    uiTheme: "kitchen-heat",
    sendLabel: "Serve the Verdict",
    animation: "shake",
    voiceId: VOICE.matthew,
  },
  {
    id: "ancient_wizard",
    label: "Ancient Wizard",
    description: "Transforms logistics into prophecy and ceremony.",
    uiTheme: "arcane-mist",
    sendLabel: "Deliver the Prophecy",
    animation: "smoke",
    voiceId: VOICE.edward,
  },
  {
    id: "pirate_captain",
    label: "Pirate Captain",
    description: "Every message becomes a mutinous demand from the deck.",
    uiTheme: "storm-sea",
    sendLabel: "Send to the Seven Seas",
    animation: "wave",
    voiceId: VOICE.matthew,
  },
  {
    id: "sports_commentator",
    label: "Sports Commentator",
    description: "Office updates narrated like a championship final.",
    uiTheme: "arena-lights",
    sendLabel: "Broadcast the Play",
    animation: "pulse",
    voiceId: VOICE.matthew,
  },
  {
    id: "noir_detective",
    label: "Noir Detective",
    description: "Rain-slicked monologue where every calendar invite hides a case.",
    uiTheme: "noir-shadow",
    sendLabel: "Close the Case",
    animation: "smoke",
    voiceId: VOICE.edward,
  },
  {
    id: "shakespearean_bard",
    label: "Shakespearean Bard",
    description: "Iambic grandeur for the pettiest of status updates.",
    uiTheme: "velvet-stage",
    sendLabel: "Perform the Verse",
    animation: "glow",
    voiceId: VOICE.david,
  },
  {
    id: "gen_z_hype",
    label: "Gen Z Hype",
    description: "Unhinged group-chat energy. It's giving corporate, but slay.",
    uiTheme: "neon-pop",
    sendLabel: "Post It fr fr",
    animation: "pulse",
    voiceId: VOICE.saunaMain,
  },
  {
    id: "zen_master",
    label: "Zen Master",
    description: "Dissolves urgency into calm, breathing, unbothered clarity.",
    uiTheme: "still-water",
    sendLabel: "Release with Peace",
    animation: "wave",
    voiceId: VOICE.matthew,
  },
  {
    id: "standup_genx",
    label: "Standup: Gen X",
    description: "Deadpan, cynical mic work — latchkey shrugs, 90s callbacks, whatever.",
    uiTheme: "grunge-club",
    sendLabel: "Drop the Set",
    animation: "pulse",
    voiceId: VOICE.matthew,
  },
  {
    id: "standup_geny",
    label: "Standup: Millennial",
    description: "Self-deprecating burnout comedy — debt, adulting, and existential dread with a smile.",
    uiTheme: "open-mic",
    sendLabel: "Land the Bit",
    animation: "glow",
    voiceId: VOICE.edward,
  },
  {
    id: "standup_genz",
    label: "Standup: Gen Z",
    description: "Absurdist, chronically-online deadpan — ironic, unbothered, lowercase energy.",
    uiTheme: "brainrot",
    sendLabel: "Send, no cap",
    animation: "shake",
    voiceId: VOICE.saunaMain,
  },
];

export const personaMap = new Map(personas.map((p) => [p.id, p]));

export function isPersonaId(value: string): value is PersonaId {
  return personaMap.has(value as PersonaId);
}
