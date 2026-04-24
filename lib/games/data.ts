export type QuestionType = "multiple-choice" | "text";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
}

export const coupleQuestions: Question[] = [
  {
    id: "q1",
    text: "What is my absolute favorite food?",
    type: "text"
  },
  {
    id: "q2",
    text: "What is my biggest pet peeve?",
    type: "multiple-choice",
    options: ["Loud chewing", "Being late", "Leaving lights on", "Interrupting"]
  },
  {
    id: "q3",
    text: "If I could travel anywhere right now, where would it be?",
    type: "text"
  },
  {
    id: "q4",
    text: "What movie can I watch over and over again without getting bored?",
    type: "text"
  },
  {
    id: "q5",
    text: "Am I a morning person or a night owl?",
    type: "multiple-choice",
    options: ["Early bird catches the worm", "Night owl all the way", "Neither, I need a nap constantly", "Depends on the coffee"]
  },
  {
    id: "q6",
    text: "What is my favorite way to relax after a long day?",
    type: "multiple-choice",
    options: ["Watching TV", "Reading a book", "Taking a bath/shower", "Working out"]
  },
  {
    id: "q7",
    text: "What was my first job?",
    type: "text"
  },
  {
    id: "q8",
    text: "Which chore do I hate doing the most?",
    type: "multiple-choice",
    options: ["Washing dishes", "Vacuuming", "Folding laundry", "Taking out trash"]
  },
  {
    id: "q9",
    text: "What did I wear on our first date?",
    type: "text"
  },
  {
    id: "q10",
    text: "What is my dream car?",
    type: "text"
  },
  {
    id: "q11",
    text: "If I won the lottery tomorrow, what is the very first thing I would buy?",
    type: "text"
  },
  {
    id: "q12",
    text: "What is my favorite season?",
    type: "multiple-choice",
    options: ["Spring", "Summer", "Autumn", "Winter"]
  },
  {
    id: "q13",
    text: "If I had to eat one meal for the rest of my life, what would it be?",
    type: "text"
  },
  {
    id: "q14",
    text: "What is my hidden talent?",
    type: "text"
  },
  {
    id: "q15",
    text: "Which describes my packing style for a trip?",
    type: "multiple-choice",
    options: ["Pack weeks in advance", "Pack the night before", "Throw things in an hour before leaving", "Make a detailed list and overpack"]
  }
];

export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...coupleQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
