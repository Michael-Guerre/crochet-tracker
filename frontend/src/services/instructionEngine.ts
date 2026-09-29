import { crochetDictionary } from "./crochetDictionary";
import type { ExpandedInstruction } from "../types/ExpandedInstruction";

function expandAction(action: string): string[] {
  const normalized = action.trim();

  if (!normalized) {
    return [];
  }

  const dictionaryEntry = crochetDictionary[normalized.toLowerCase()];

  if (!dictionaryEntry || dictionaryEntry.producedStitches <= 1) {
    return [normalized];
  }

  return Array.from({ length: dictionaryEntry.producedStitches }, (_, index) => {
    const step = index + 1;
    return `${normalized} ${step}/${dictionaryEntry.producedStitches}`;
  });
}

export function unpackInstruction(instruction: string): string[] {
  const normalized = instruction.trim();

  if (!normalized) {
    return [];
  }

  const bracketRepeat = normalized.match(/^\[(.+)\]\s*x\s*(\d+)$/i);
  if (bracketRepeat) {
    const sequence = bracketRepeat[1]
      .split(",")
      .map((step) => step.trim())
      .filter(Boolean);

    const repetitions = Number(bracketRepeat[2]);
    const steps: string[] = [];

    for (let i = 0; i < repetitions; i++) {
      for (const step of sequence) {
        steps.push(...expandAction(step));
      }
    }

    return steps;
  }

  const simpleRepeat = normalized.match(/^(.+?)\s*x\s*(\d+)$/i);
  if (simpleRepeat) {
    const action = simpleRepeat[1].trim();
    const repetitions = Number(simpleRepeat[2]);

    if (!action) return [];

    return Array.from({ length: repetitions }, () => expandAction(action)).flat();
  }

  const countAction = normalized.match(/^(\d+)\s+(.+)$/i);
  if (countAction) {
    const repetitions = Number(countAction[1]);
    const action = countAction[2].trim();

    if (!action) return [];

    return Array.from({ length: repetitions }, () => expandAction(action)).flat();
  }

  return expandAction(normalized);
}

export function expandInstruction(
  instruction: string,
  currentStepIndex: number = 0
): ExpandedInstruction {
  return {
    steps: unpackInstruction(instruction),
    currentStepIndex,
  };
}

