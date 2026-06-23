import { crochetDictionary } from "./crochetDictionary";

export function translateInstruction(text: string): string {
  let result = text;

  for (const [key, value] of Object.entries(crochetDictionary)) {
    const regex = new RegExp(`\\b${key}\\b`, "gi");
    result = result.replace(regex, value);
  }

  return result;
}
