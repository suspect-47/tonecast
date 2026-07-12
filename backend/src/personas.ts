export type PersonaId =
  | "movie_trailer"
  | "furious_chef"
  | "ancient_wizard"
  | "pirate_captain"
  | "sports_commentator";

export type PersonaConfig = {
  id: PersonaId;
  label: string;
  description: string;
  uiTheme: string;
  sendLabel: string;
  animation: "glow" | "shake" | "smoke" | "wave" | "pulse";
};

export const personas: PersonaConfig[] = [
  {
    id: "movie_trailer",
    label: "Movie Trailer",
    description: "Treats routine messages like world-changing cinema.",
    uiTheme: "trailer-fire",
    sendLabel: "Release the Trailer",
    animation: "glow"
  },
  {
    id: "furious_chef",
    label: "Furious Chef",
    description: "High heat, sharp criticism, and dramatic seasoning.",
    uiTheme: "kitchen-heat",
    sendLabel: "Serve the Verdict",
    animation: "shake"
  },
  {
    id: "ancient_wizard",
    label: "Ancient Wizard",
    description: "Transforms logistics into prophecy and ceremony.",
    uiTheme: "arcane-mist",
    sendLabel: "Deliver the Prophecy",
    animation: "smoke"
  },
  {
    id: "pirate_captain",
    label: "Pirate Captain",
    description: "Every message becomes a mutinous demand from the deck.",
    uiTheme: "storm-sea",
    sendLabel: "Send to the Seven Seas",
    animation: "wave"
  },
  {
    id: "sports_commentator",
    label: "Sports Commentator",
    description: "Office updates narrated like a championship final.",
    uiTheme: "arena-lights",
    sendLabel: "Broadcast the Play",
    animation: "pulse"
  }
];

export const personaMap = new Map(personas.map((persona) => [persona.id, persona]));
