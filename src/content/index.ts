import type { LevelCode } from "@/lib/constants";
import type { LessonSeed } from "@/content/types";
import { lesson01 } from "@/content/lessons/lesson01";
import { lesson02 } from "@/content/lessons/lesson02";
import { lesson03 } from "@/content/lessons/lesson03";
import { lesson04 } from "@/content/lessons/lesson04";
import { lesson05 } from "@/content/lessons/lesson05";
import { lesson06 } from "@/content/lessons/lesson06";
import { lesson07 } from "@/content/lessons/lesson07";
import { lesson08 } from "@/content/lessons/lesson08";
import { lesson09 } from "@/content/lessons/lesson09";
import { lesson10 } from "@/content/lessons/lesson10";

export interface LevelSeed {
  code: LevelCode;
  slug: string;
  title: string;
  description: string;
  order: number;
}

export const courseSeed = {
  slug: "missao-ingles",
  title: "Missão Inglês — Operações & Conversação",
  description:
    "Curso de inglês para brasileiros, do iniciante absoluto ao intermediário, com vocabulário e situações de missão/operação. Aulas curtas, prática de pronúncia e professor de IA.",
  language: "en",
  estimatedHours: 20,
};

export const levelsSeed: LevelSeed[] = [
  {
    code: "A1",
    slug: "a1-fundamentos",
    title: "A1 — Fundamentos",
    description:
      "Primeiros contatos, apresentação, verbos essenciais e pedidos básicos.",
    order: 1,
  },
  {
    code: "A2",
    slug: "a2-sobrevivencia",
    title: "A2 — Sobrevivência e rotina",
    description:
      "Rotina, horários, deslocamento, direções e logística do dia a dia.",
    order: 2,
  },
  {
    code: "B1",
    slug: "b1-conversacao",
    title: "B1 — Conversação prática",
    description:
      "Passado, planos, experiências e simulação de conversa real em missão.",
    order: 3,
  },
];

export const allLessons: LessonSeed[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
];
