// Prepared demo samples with hand-made annotations. The demo engine
// recognises a sample by the SHA-256 of the exact file served from
// /public/demo-samples; any other image gets no detections.
// Shared by the server (engine) and the client (sample picker).

import type { Detection } from "@/lib/dashboard";

export interface DemoSample {
  id: string;
  title: string;
  /** Public URL of the original file. */
  url: string;
  sha256: string;
  /** Object the sample is meant for in the demo script. */
  suggestedObjectId: string;
  detections: Detection[];
}

export const demoSamples: DemoSample[] = [
  {
    id: "volga-span",
    title: "Мост через р. Волга — пролёт 7, кромка плиты",
    url: "/demo-samples/volga-span.jpg",
    sha256: "267a438c0be1eefa6083e52201925675f517428ebf43cd1bc460c2c5b8309b05",
    suggestedObjectId: "obj-1",
    detections: [
      {
        type: "Коррозия арматуры",
        severity: "critical",
        bbox: { x: 26, y: 18, w: 44, h: 37 },
        confidence: 94,
        location: "Пролёт 7, кромка плиты проезжей части",
        recommendation:
          "Вскрытие защитного слоя, оценка потери сечения арматуры, антикоррозийная обработка; ограничение нагрузки до решения инженера.",
      },
      {
        type: "Выкрашивание бетона",
        severity: "medium",
        bbox: { x: 25, y: 47, w: 23, h: 20 },
        confidence: 88,
        location: "Пролёт 7, торец плиты",
        recommendation: "Удаление разрушенного бетона и восстановление защитного слоя ремонтным составом.",
      },
      {
        type: "Сетка трещин с выщелачиванием",
        severity: "medium",
        bbox: { x: 40, y: 50, w: 60, h: 27 },
        confidence: 81,
        location: "Пролёт 7, нижняя грань плиты",
        recommendation: "Инструментальное обследование гидроизоляции, инъектирование трещин.",
      },
    ],
  },
  {
    id: "kama-pier",
    title: "Мост через р. Кама — опора, оголовок",
    url: "/demo-samples/kama-pier.jpg",
    sha256: "b0335d1d9fd469cfdf4501ee6c6bc9c90cb6efff97fed201cf0e838cd67c844a",
    suggestedObjectId: "obj-5",
    detections: [
      {
        type: "Коррозия арматуры",
        severity: "critical",
        bbox: { x: 30, y: 0, w: 10, h: 24 },
        confidence: 92,
        location: "Опора №2, оголовок, левая грань",
        recommendation: "Дефектоскопия опоры, оценка несущей способности, ремонт защитного слоя.",
      },
      {
        type: "Выкрашивание бетона с оголением арматуры",
        severity: "medium",
        bbox: { x: 58, y: 14, w: 8, h: 34 },
        confidence: 89,
        location: "Опора №2, правая грань",
        recommendation: "Зачистка арматуры, восстановление защитного слоя.",
      },
      {
        type: "Выкрашивание бетона",
        severity: "critical",
        bbox: { x: 37, y: 70, w: 17, h: 30 },
        confidence: 90,
        location: "Опора №2, нижняя зона",
        recommendation: "Срочное обследование нижней зоны опоры, временное усиление при необходимости.",
      },
    ],
  },
  {
    id: "don-potholes",
    title: "М-4 «Дон» — группа выбоин, км 338",
    url: "/demo-samples/don-potholes.jpg",
    sha256: "3a356ede95d9f98e13a9a0cb2995d8d073c11a985f160fbdd75aa0f0c7a3d35e",
    suggestedObjectId: "obj-2",
    detections: [
      {
        type: "Выбоина",
        severity: "critical",
        bbox: { x: 41, y: 36, w: 59, h: 21 },
        confidence: 93,
        location: "км 338, полоса движения",
        recommendation: "Ограждение участка, ямочный ремонт литым асфальтобетоном в течение 3 суток.",
      },
      {
        type: "Выбоина",
        severity: "critical",
        bbox: { x: 0, y: 70, w: 35, h: 30 },
        confidence: 95,
        location: "км 338, кромка покрытия",
        recommendation: "Ограждение участка, ямочный ремонт с обрубкой кромок.",
      },
      {
        type: "Выбоина",
        severity: "medium",
        bbox: { x: 21, y: 21, w: 39, h: 15 },
        confidence: 91,
        location: "км 338, правая полоса",
        recommendation: "Ямочный ремонт в плановом порядке.",
      },
      {
        type: "Выбоина",
        severity: "low",
        bbox: { x: 84, y: 73, w: 15, h: 12 },
        confidence: 76,
        location: "км 338, обочина",
        recommendation: "Наблюдение, включение в план текущего ремонта.",
      },
    ],
  },
  {
    id: "city-street",
    title: "Городская магистраль — внутриквартальный проезд",
    url: "/demo-samples/city-street.jpg",
    sha256: "c6da77a9618d75ea312ea041214b1e9be8b170a70b71f464d1ddebea8e346a01",
    suggestedObjectId: "obj-8",
    detections: [
      {
        type: "Выбоина",
        severity: "medium",
        bbox: { x: 55, y: 62, w: 33, h: 10 },
        confidence: 90,
        location: "Внутриквартальный проезд, правая сторона",
        recommendation: "Ямочный ремонт в плановом порядке.",
      },
      {
        type: "Выбоина",
        severity: "medium",
        bbox: { x: 30, y: 82, w: 19, h: 8 },
        confidence: 87,
        location: "Внутриквартальный проезд, ось проезда",
        recommendation: "Ямочный ремонт в плановом порядке.",
      },
      {
        type: "Выбоина",
        severity: "low",
        bbox: { x: 59, y: 74, w: 14, h: 6 },
        confidence: 74,
        location: "Внутриквартальный проезд",
        recommendation: "Наблюдение при следующем обследовании.",
      },
    ],
  },
  {
    id: "pothole-cracks",
    title: "Выбоина с застоем воды и сеткой трещин",
    url: "/demo-samples/pothole-cracks.jpg",
    sha256: "509e249240e6b0b0a499d9d143189bb68564dc9b7048246743d57767c2e36e9f",
    suggestedObjectId: "obj-4",
    detections: [
      {
        type: "Выбоина с застоем воды",
        severity: "medium",
        bbox: { x: 37, y: 40, w: 31, h: 22 },
        confidence: 92,
        location: "Полоса движения",
        recommendation: "Ямочный ремонт, проверка водоотвода на участке.",
      },
      {
        type: "Сетка трещин",
        severity: "low",
        bbox: { x: 2, y: 62, w: 96, h: 36 },
        confidence: 84,
        location: "Полоса движения, после выбоины",
        recommendation: "Поверхностная обработка, наблюдение.",
      },
    ],
  },
  {
    id: "pothole-manhole",
    title: "Выбоина у люка смотрового колодца",
    url: "/demo-samples/pothole-manhole.jpg",
    sha256: "11268e587c800931a2560b429bf56bd50e343c61ab8de07320878c30bf27d6b5",
    suggestedObjectId: "obj-8",
    detections: [
      {
        type: "Выбоина",
        severity: "critical",
        bbox: { x: 62, y: 18, w: 35, h: 35 },
        confidence: 93,
        location: "У люка смотрового колодца",
        recommendation: "Ограждение, ремонт покрытия вокруг люка в течение 3 суток.",
      },
      {
        type: "Разрушение покрытия вокруг люка",
        severity: "medium",
        bbox: { x: 0, y: 2, w: 60, h: 91 },
        confidence: 80,
        location: "Обойма люка",
        recommendation: "Замена обоймы люка, восстановление покрытия.",
      },
    ],
  },
];
