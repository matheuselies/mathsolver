export const correctMessages = [
  "Boa! Isso foi rápido demais 🚀",
  "Certíssimo! O cérebro tá turbinado hoje 🔥",
  "Acertou em cheio! Mais uma pro placar ✨",
  "Perfeito! Matemática 1 × 0 dúvidas 💪",
  "Isso aí! Segue o combo 🎯",
];

export const wrongMessages = [
  "Quase lá! Bora ver onde escorregou 👀",
  "Calma, errar faz parte — olha o caminho certo 🙂",
  "Ops! Nada de desanimar, a próxima é sua 💡",
  "Fica tranquilo: agora vais perceber para sempre 🧠",
  "Não foi dessa vez, mas o próximo passo é fácil ✌️",
];

export const randomFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]!;
