import type { ExpandedInstruction } from "../types/ExpandedInstruction";

export function expandInstruction(
  instruction: string
): ExpandedInstruction {

  // Cas : [sc, inc] x6
  const repeatMatch = instruction.match(
    /^\[(.+)\]\s*x(\d+)$/i
  );

  if (repeatMatch) {
    const sequence = repeatMatch[1]
      .split(",")
      .map(step => step.trim());

    const repetitions = Number(repeatMatch[2]);

    const steps: string[] = [];

    for (let i = 0; i < repetitions; i++) {
      steps.push(...sequence);
    }

    return { steps };
  }

  // Cas simple : "inc x6"
  const simpleRepeat = instruction.match(
    /^(.+)\s*x(\d+)$/i
  );

  if (simpleRepeat) {
    const action = simpleRepeat[1].trim();
    const repetitions = Number(simpleRepeat[2]);

    return {
      steps: Array(repetitions).fill(action)
    };
  }

  // Cas : "6 sc"
  const countAction = instruction.match(
    /^(\d+)\s+(.+)$/i
  );

  if (countAction) {
    const repetitions = Number(countAction[1]);
    const action = countAction[2].trim();

    return {
      steps: Array(repetitions).fill(action)
    };
  }

  // Fallback
  return {
    steps: [instruction]
  };
}
