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
    text: "מהו המאכל האהוב עליי ביותר?",
    type: "text"
  },
  {
    id: "q2",
    text: "מה הכי מעצבן אותי?",
    type: "multiple-choice",
    options: ["לעיסות רועשות", "איחורים", "להשאיר אורות דולקים", "שנכנסים לי לדברים"]
  },
  {
    id: "q3",
    text: "אם הייתי יכול/ה לטוס עכשיו לכל מקום בעולם, לאן הייתי טס/ה?",
    type: "text"
  },
  {
    id: "q4",
    text: "איזה סרט אני יכול/ה לראות שוב ושוב בלי שיימאס לי?",
    type: "text"
  },
  {
    id: "q5",
    text: "האם אני אדם של בוקר או ציפור לילה?",
    type: "multiple-choice",
    options: ["משכים קום", "ציפור לילה לגמרי", "אף אחד מהם, אני תמיד צריך/ה שנ"צ", "תלוי בקפה"]
  },
  {
    id: "q6",
    text: "איך אני הכי אוהב/ת להירגע אחרי יום ארוך?",
    type: "multiple-choice",
    options: ["לראות טלוויזיה", "לקרוא ספר", "מקלחת טובה/אמבטיה", "אימון"]
  },
  {
    id: "q7",
    text: "מה הייתה העבודה הראשונה שלי?",
    type: "text"
  },
  {
    id: "q8",
    text: "איזו מטלה בבית אני הכי שונא/ת לעשות?",
    type: "multiple-choice",
    options: ["לשטוף כלים", "לשאוב אבק", "לקפל כביסה", "לזרוק את הזבל"]
  },
  {
    id: "q9",
    text: "מה לבשתי בדייט הראשון שלנו?",
    type: "text"
  },
  {
    id: "q10",
    text: "מהו רכב החלומות שלי?",
    type: "text"
  },
  {
    id: "q11",
    text: "אם הייתי זוכה מחר בלוטו, מה הדבר הראשון שהייתי קונה?",
    type: "text"
  },
  {
    id: "q12",
    text: "מהי העונה האהובה עליי?",
    type: "multiple-choice",
    options: ["אביב", "קיץ", "סתיו", "חורף"]
  },
  {
    id: "q13",
    text: "אם הייתי צריך/ה לאכול מאכל אחד לשארית חיי, מה זה היה?",
    type: "text"
  },
  {
    id: "q14",
    text: "מהו הכישרון החבוי שלי?",
    type: "text"
  },
  {
    id: "q15",
    text: "איך אני בדרך כלל אורז/ת לטיול?",
    type: "multiple-choice",
    options: ["אורז/ת שבועות מראש", "אורז/ת ערב לפני", "זורק/ת דברים למזוודה שעה לפני", "מכין/ה רשימה מפורטת ואורז/ת יותר מדי"]
  }
];

export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...coupleQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
