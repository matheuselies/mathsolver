export type PlayerState = {
  nickname: string;
  phase: number;
  streak: number;
  checkpoint: number;
  completed: boolean;
  totalCorrect: number;
  totalWrong: number;
};

export type ExerciseView = {
  token: string;
  prompt: string;
  topic: string;
  topicLabel: string;
  difficulty: number;
  kind: "inteiro" | "fracao" | "decimal";
  hint: string;
  phase: number;
};

export type AnswerFeedback = {
  correct: boolean;
  message: string;
  formula: string;
  steps: string[];
  correctAnswer: string;
  state?: PlayerState;
  phaseUp?: boolean;
  finished?: boolean;
};
