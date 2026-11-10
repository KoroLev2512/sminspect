// Deterministic demo dataset for the SmartInspect dashboard.
// Generated once from the original mock data, with dates moved into the demo
// period that ends on DEMO_AS_OF (lib/dashboard.ts). Edit the data here, not in
// components. The client store (components/DemoDataProvider.tsx) copies it on
// first load and on «Сбросить демо».

import type { DemoState } from "@/lib/dashboard";

export const DEMO_SEED_VERSION = 3;

const seed: Omit<DemoState, "version"> = {
  objects: [
  {
    "id": "obj-1",
    "name": "Мост через р. Волга, М-7 «Волга»",
    "type": "bridge",
    "region": "Нижегородская обл.",
    "lat": 56.3,
    "lng": 44,
    "length": "1 240 м",
    "image": "/images/inspect/obj-1.jpg",
    "baseScore": 80,
    "conditionHistory": [
      {
        "month": "2026-05",
        "value": 63
      },
      {
        "month": "2026-06",
        "value": 59
      },
      {
        "month": "2026-07",
        "value": 55
      },
      {
        "month": "2026-08",
        "value": 50
      },
      {
        "month": "2026-09",
        "value": 46
      }
    ],
    "forecastMonths": 2
  },
  {
    "id": "obj-2",
    "name": "Автодорога М-4 «Дон», км 320–360",
    "type": "road",
    "region": "Воронежская обл.",
    "lat": 51.66,
    "lng": 39.2,
    "length": "40 км",
    "image": "/images/inspect/obj-2.jpg",
    "baseScore": 88,
    "conditionHistory": [
      {
        "month": "2026-05",
        "value": 75
      },
      {
        "month": "2026-06",
        "value": 73
      },
      {
        "month": "2026-07",
        "value": 71
      },
      {
        "month": "2026-08",
        "value": 68
      },
      {
        "month": "2026-09",
        "value": 66
      }
    ],
    "forecastMonths": 7
  },
  {
    "id": "obj-3",
    "name": "Путепровод на ул. Профсоюзная",
    "type": "bridge",
    "region": "Москва",
    "lat": 55.65,
    "lng": 37.55,
    "length": "320 м",
    "image": "/images/inspect/obj-3.jpg",
    "baseScore": 80,
    "conditionHistory": [
      {
        "month": "2026-05",
        "value": 85
      },
      {
        "month": "2026-06",
        "value": 84
      },
      {
        "month": "2026-07",
        "value": 83
      },
      {
        "month": "2026-08",
        "value": 81
      },
      {
        "month": "2026-09",
        "value": 80
      }
    ],
    "forecastMonths": 16
  },
  {
    "id": "obj-4",
    "name": "Западный скоростной диаметр (ЗСД)",
    "type": "road",
    "region": "Санкт-Петербург",
    "lat": 59.95,
    "lng": 30.23,
    "length": "46,6 км",
    "image": "/images/inspect/obj-4.jpg",
    "baseScore": 87,
    "conditionHistory": [
      {
        "month": "2026-05",
        "value": 78
      },
      {
        "month": "2026-06",
        "value": 77
      },
      {
        "month": "2026-07",
        "value": 76
      },
      {
        "month": "2026-08",
        "value": 74
      },
      {
        "month": "2026-09",
        "value": 73
      }
    ],
    "forecastMonths": 9
  },
  {
    "id": "obj-5",
    "name": "Мост через р. Кама, трасса Р-239",
    "type": "bridge",
    "region": "Респ. Татарстан",
    "lat": 55.74,
    "lng": 52.4,
    "length": "980 м",
    "image": "/images/inspect/obj-5.jpg",
    "baseScore": 91,
    "conditionHistory": [
      {
        "month": "2026-05",
        "value": 69
      },
      {
        "month": "2026-06",
        "value": 66
      },
      {
        "month": "2026-07",
        "value": 63
      },
      {
        "month": "2026-08",
        "value": 59
      },
      {
        "month": "2026-09",
        "value": 56
      }
    ],
    "forecastMonths": 4
  },
  {
    "id": "obj-6",
    "name": "Автодорога А-121 «Сортавала»",
    "type": "road",
    "region": "Ленинградская обл.",
    "lat": 60.7,
    "lng": 30.6,
    "length": "62 км",
    "image": "/images/inspect/obj-6.jpg",
    "baseScore": 86,
    "conditionHistory": [
      {
        "month": "2026-05",
        "value": 91
      },
      {
        "month": "2026-06",
        "value": 90
      },
      {
        "month": "2026-07",
        "value": 89
      },
      {
        "month": "2026-08",
        "value": 87
      },
      {
        "month": "2026-09",
        "value": 86
      }
    ],
    "forecastMonths": 9
  },
  {
    "id": "obj-7",
    "name": "Эстакада «Южный обход»",
    "type": "bridge",
    "region": "Краснодарский край",
    "lat": 45.04,
    "lng": 38.98,
    "length": "540 м",
    "image": "/images/inspect/obj-7.jpg",
    "baseScore": 81,
    "conditionHistory": [
      {
        "month": "2026-05",
        "value": 70
      },
      {
        "month": "2026-06",
        "value": 68
      },
      {
        "month": "2026-07",
        "value": 66
      },
      {
        "month": "2026-08",
        "value": 63
      },
      {
        "month": "2026-09",
        "value": 61
      }
    ],
    "forecastMonths": 6
  },
  {
    "id": "obj-8",
    "name": "Городская магистраль, пр. Ленина",
    "type": "road",
    "region": "Екатеринбург",
    "lat": 56.84,
    "lng": 60.61,
    "length": "12 км",
    "image": "/images/inspect/obj-8.jpg",
    "baseScore": 95,
    "conditionHistory": [
      {
        "month": "2026-05",
        "value": 90
      },
      {
        "month": "2026-06",
        "value": 90
      },
      {
        "month": "2026-07",
        "value": 90
      },
      {
        "month": "2026-08",
        "value": 89
      },
      {
        "month": "2026-09",
        "value": 89
      }
    ],
    "forecastMonths": 24
  }
],
  inspections: [
  {
    "id": "insp-22",
    "title": "Видеообследование с БПЛА — А-121 «Сортавала»",
    "objectId": "obj-6",
    "date": "2026-10-31",
    "source": "drone",
    "operator": "БПЛА-бригада №1",
    "coverage": "видео 38 с, км 40–42 · 4 кадра",
    "description": "Облёт участка км 40–42 с видеозаписью (38 с, 1920×1080). Из видео извлечены 4 кадра с признаками повреждений.",
    "status": "completed",
    "createdAt": "2026-10-31T10:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-10-31T10:00:00"
      },
      {
        "status": "queued",
        "at": "2026-10-31T10:02:00"
      },
      {
        "status": "processing",
        "at": "2026-10-31T10:03:00"
      },
      {
        "status": "completed",
        "at": "2026-10-31T10:09:00"
      }
    ],
    "materials": [
      {
        "id": "mat-a121-video-025",
        "name": "Кадр видео 00:02.5.jpg",
        "url": "/demo-samples/a121-video-025.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Лёд / вода в колее",
              "severity": "low",
              "bbox": {
                "x": 36,
                "y": 41,
                "w": 7,
                "h": 18
              },
              "confidence": 86,
              "location": "км 40+350, левая колея",
              "recommendation": "Наблюдение; противогололёдная обработка, при повторении — выравнивание колеи."
            },
            {
              "type": "Лёд / вода в колее",
              "severity": "low",
              "bbox": {
                "x": 57,
                "y": 43,
                "w": 3,
                "h": 11
              },
              "confidence": 81,
              "location": "км 40+350, правая колея",
              "recommendation": "Наблюдение; противогололёдная обработка."
            }
          ]
        }
      },
      {
        "id": "mat-a121-video-125",
        "name": "Кадр видео 00:12.5.jpg",
        "url": "/demo-samples/a121-video-125.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Выбоина с водой",
              "severity": "medium",
              "bbox": {
                "x": 50,
                "y": 22,
                "w": 6,
                "h": 18
              },
              "confidence": 89,
              "location": "км 40+900, ось проезжей части",
              "recommendation": "Ямочный ремонт после схода воды; проверить водоотвод участка."
            }
          ]
        }
      },
      {
        "id": "mat-a121-video-225",
        "name": "Кадр видео 00:22.5.jpg",
        "url": "/demo-samples/a121-video-225.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Вода в колее",
              "severity": "medium",
              "bbox": {
                "x": 55,
                "y": 53,
                "w": 13,
                "h": 40
              },
              "confidence": 88,
              "location": "км 41+400, правая полоса",
              "recommendation": "Обследование колейности, восстановление поперечного профиля и водоотвода."
            },
            {
              "type": "Выбоины",
              "severity": "low",
              "bbox": {
                "x": 61,
                "y": 37,
                "w": 15,
                "h": 8
              },
              "confidence": 79,
              "location": "км 41+430, правая полоса",
              "recommendation": "Включить в план ямочного ремонта."
            }
          ]
        }
      },
      {
        "id": "mat-a121-video-275",
        "name": "Кадр видео 00:27.5.jpg",
        "url": "/demo-samples/a121-video-275.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Разрушение кромки покрытия",
              "severity": "medium",
              "bbox": {
                "x": 74,
                "y": 27,
                "w": 5,
                "h": 31
              },
              "confidence": 87,
              "location": "км 41+700, правая кромка",
              "recommendation": "Восстановление кромки и укрепление обочины."
            },
            {
              "type": "Выбоина",
              "severity": "low",
              "bbox": {
                "x": 72.5,
                "y": 43,
                "w": 3,
                "h": 3
              },
              "confidence": 77,
              "location": "км 41+720, у правой кромки",
              "recommendation": "Включить в план ямочного ремонта."
            },
            {
              "type": "Выбоины",
              "severity": "low",
              "bbox": {
                "x": 69,
                "y": 80,
                "w": 15,
                "h": 8
              },
              "confidence": 80,
              "location": "км 41+680, правая полоса",
              "recommendation": "Включить в план ямочного ремонта."
            }
          ]
        }
      }
    ],
    "savedDefectIds": [
      "def-19",
      "def-20",
      "def-21",
      "def-22",
      "def-23",
      "def-24",
      "def-25",
      "def-26"
    ]
  },
  {
    "id": "insp-1",
    "title": "Плановое обследование — мост через р. Волга",
    "objectId": "obj-1",
    "date": "2026-10-30",
    "source": "drone",
    "operator": "БПЛА-бригада №2",
    "coverage": "100% пролётов",
    "description": "Плановое обследование по графику мониторинга. Снимки размечены модулем анализа.",
    "status": "completed",
    "createdAt": "2026-10-30T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-10-30T08:00:00"
      },
      {
        "status": "queued",
        "at": "2026-10-30T08:05:00"
      },
      {
        "status": "processing",
        "at": "2026-10-30T08:06:00"
      },
      {
        "status": "completed",
        "at": "2026-10-30T08:20:00"
      }
    ],
    "materials": [
      {
        "id": "mat-def-1",
        "name": "INSP-1_001.jpg",
        "url": "/images/inspect/def-1.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Коррозия арматуры",
              "severity": "critical",
              "bbox": {
                "x": 12,
                "y": 14,
                "w": 76,
                "h": 58
              },
              "confidence": 96,
              "location": "Опора №4, нижний пояс",
              "recommendation": "Немедленное обследование опоры, ограничение нагрузки."
            }
          ]
        }
      },
      {
        "id": "mat-def-2",
        "name": "INSP-1_002.jpg",
        "url": "/images/inspect/def-2.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Трещина в пролётном строении",
              "severity": "critical",
              "bbox": {
                "x": 38,
                "y": 18,
                "w": 32,
                "h": 40
              },
              "confidence": 92,
              "location": "Пролёт 7, балка Б-2",
              "recommendation": "Установка маяков, мониторинг раскрытия, ремонт в течение 30 дней."
            }
          ]
        }
      },
      {
        "id": "mat-def-3",
        "name": "INSP-1_003.jpg",
        "url": "/images/inspect/def-3.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Разрушение деформационного шва",
              "severity": "medium",
              "bbox": {
                "x": 22,
                "y": 38,
                "w": 76,
                "h": 30
              },
              "confidence": 88,
              "location": "Пролёт 3",
              "recommendation": "Плановая замена шва при ближайшем ремонте."
            }
          ]
        }
      }
    ],
    "savedDefectIds": [
      "def-1",
      "def-2",
      "def-3"
    ]
  },
  {
    "id": "insp-5",
    "title": "Плановое обследование — мост через р. Кама",
    "objectId": "obj-5",
    "date": "2026-10-28",
    "source": "drone",
    "operator": "БПЛА-бригада №2",
    "coverage": "100% пролётов",
    "description": "Плановое обследование по графику мониторинга. Снимки размечены модулем анализа.",
    "status": "completed",
    "createdAt": "2026-10-28T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-10-28T08:00:00"
      },
      {
        "status": "queued",
        "at": "2026-10-28T08:05:00"
      },
      {
        "status": "processing",
        "at": "2026-10-28T08:06:00"
      },
      {
        "status": "completed",
        "at": "2026-10-28T08:20:00"
      }
    ],
    "materials": [
      {
        "id": "mat-def-9",
        "name": "INSP-5_001.jpg",
        "url": "/images/inspect/def-9.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Коррозия металлоконструкций",
              "severity": "critical",
              "bbox": {
                "x": 8,
                "y": 8,
                "w": 84,
                "h": 80
              },
              "confidence": 95,
              "location": "Опора №2",
              "recommendation": "Зачистка, оценка потери сечения, антикоррозийная защита."
            }
          ]
        }
      },
      {
        "id": "mat-def-10",
        "name": "INSP-5_002.jpg",
        "url": "/images/inspect/def-10.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Деформация пролёта",
              "severity": "critical",
              "bbox": {
                "x": 22,
                "y": 14,
                "w": 54,
                "h": 74
              },
              "confidence": 89,
              "location": "Пролёт 5",
              "recommendation": "Геодезический мониторинг, ограничение движения большегрузов."
            }
          ]
        }
      },
      {
        "id": "mat-def-11",
        "name": "INSP-5_003.jpg",
        "url": "/images/inspect/def-11.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Выкрашивание бетона",
              "severity": "medium",
              "bbox": {
                "x": 36,
                "y": 5,
                "w": 28,
                "h": 90
              },
              "confidence": 85,
              "location": "Опора №6",
              "recommendation": "Ремонт защитного слоя бетона."
            }
          ]
        }
      }
    ],
    "savedDefectIds": [
      "def-9",
      "def-10",
      "def-11"
    ]
  },
  {
    "id": "insp-2",
    "title": "Плановое обследование — М-4 «Дон», км 320–360",
    "objectId": "obj-2",
    "date": "2026-10-27",
    "source": "mobile",
    "operator": "Мобильный комплекс А-1",
    "coverage": "40 км",
    "description": "Плановое обследование по графику мониторинга. Снимки размечены модулем анализа.",
    "status": "completed",
    "createdAt": "2026-10-27T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-10-27T08:00:00"
      },
      {
        "status": "queued",
        "at": "2026-10-27T08:05:00"
      },
      {
        "status": "processing",
        "at": "2026-10-27T08:06:00"
      },
      {
        "status": "completed",
        "at": "2026-10-27T08:20:00"
      }
    ],
    "materials": [
      {
        "id": "mat-def-4",
        "name": "INSP-2_001.jpg",
        "url": "/images/inspect/def-4.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Выбоина",
              "severity": "critical",
              "bbox": {
                "x": 24,
                "y": 32,
                "w": 50,
                "h": 52
              },
              "confidence": 94,
              "location": "км 334, правая полоса",
              "recommendation": "Аварийная заделка, риск повреждения ТС."
            }
          ]
        }
      },
      {
        "id": "mat-def-5",
        "name": "INSP-2_002.jpg",
        "url": "/images/inspect/def-5.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Выбоина с разрушением кромок",
              "severity": "medium",
              "bbox": {
                "x": 0,
                "y": 15,
                "w": 45,
                "h": 58
              },
              "confidence": 90,
              "location": "км 341–345",
              "recommendation": "Вырубка, подгрунтовка и заполнение горячей асфальтобетонной смесью."
            }
          ]
        }
      },
      {
        "id": "mat-def-6",
        "name": "INSP-2_003.jpg",
        "url": "/images/inspect/def-6.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Сетка трещин",
              "severity": "low",
              "bbox": {
                "x": 2,
                "y": 14,
                "w": 94,
                "h": 56
              },
              "confidence": 83,
              "location": "км 350, обочина",
              "recommendation": "Поверхностная обработка, наблюдение."
            }
          ]
        }
      }
    ],
    "savedDefectIds": [
      "def-4",
      "def-5",
      "def-6"
    ]
  },
  {
    "id": "insp-3",
    "title": "Плановое обследование — ЗСД",
    "objectId": "obj-4",
    "date": "2026-10-24",
    "source": "drone",
    "operator": "БПЛА-бригада №1",
    "coverage": "46,6 км",
    "description": "Плановое обследование по графику мониторинга. Снимки размечены модулем анализа.",
    "status": "completed",
    "createdAt": "2026-10-24T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-10-24T08:00:00"
      },
      {
        "status": "queued",
        "at": "2026-10-24T08:05:00"
      },
      {
        "status": "processing",
        "at": "2026-10-24T08:06:00"
      },
      {
        "status": "completed",
        "at": "2026-10-24T08:20:00"
      }
    ],
    "materials": [
      {
        "id": "mat-def-7",
        "name": "INSP-3_001.jpg",
        "url": "/images/inspect/def-7.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Выбоина",
              "severity": "critical",
              "bbox": {
                "x": 30,
                "y": 40,
                "w": 45,
                "h": 44
              },
              "confidence": 91,
              "location": "км 18, съезд",
              "recommendation": "Аварийная заделка в течение 48 часов."
            }
          ]
        }
      },
      {
        "id": "mat-def-8",
        "name": "INSP-3_002.jpg",
        "url": "/images/inspect/def-8.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Продольная трещина",
              "severity": "medium",
              "bbox": {
                "x": 22,
                "y": 10,
                "w": 62,
                "h": 78
              },
              "confidence": 87,
              "location": "км 22",
              "recommendation": "Устранено: герметизация трещины."
            }
          ]
        }
      }
    ],
    "savedDefectIds": [
      "def-7",
      "def-8"
    ]
  },
  {
    "id": "insp-4",
    "title": "Плановое обследование — эстакада «Южный обход»",
    "objectId": "obj-7",
    "date": "2026-10-23",
    "source": "sensor",
    "operator": "Сеть сенсоров SI-540",
    "coverage": "непрерывный мониторинг",
    "description": "Плановое обследование по графику мониторинга. Снимки размечены модулем анализа.",
    "status": "completed",
    "createdAt": "2026-10-23T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-10-23T08:00:00"
      },
      {
        "status": "queued",
        "at": "2026-10-23T08:05:00"
      },
      {
        "status": "processing",
        "at": "2026-10-23T08:06:00"
      },
      {
        "status": "completed",
        "at": "2026-10-23T08:20:00"
      }
    ],
    "materials": [
      {
        "id": "mat-def-12",
        "name": "INSP-4_001.jpg",
        "url": "/images/inspect/def-12.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Просадка опоры",
              "severity": "critical",
              "bbox": {
                "x": 20,
                "y": 8,
                "w": 30,
                "h": 80
              },
              "confidence": 90,
              "location": "Опора №3",
              "recommendation": "Инструментальное обследование фундамента."
            }
          ]
        }
      },
      {
        "id": "mat-def-13",
        "name": "INSP-4_002.jpg",
        "url": "/images/inspect/def-13.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Трещина",
              "severity": "medium",
              "bbox": {
                "x": 20,
                "y": 10,
                "w": 46,
                "h": 76
              },
              "confidence": 86,
              "location": "Пролёт 2",
              "recommendation": "Мониторинг, ремонт при плановом обслуживании."
            }
          ]
        }
      }
    ],
    "savedDefectIds": [
      "def-12",
      "def-13"
    ]
  },
  {
    "id": "insp-6",
    "title": "Плановое обследование — пр. Ленина",
    "objectId": "obj-8",
    "date": "2026-10-22",
    "source": "mobile",
    "operator": "Мобильный комплекс А-2",
    "coverage": "12 км",
    "description": "Плановое обследование по графику мониторинга. Снимки размечены модулем анализа.",
    "status": "completed",
    "createdAt": "2026-10-22T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-10-22T08:00:00"
      },
      {
        "status": "queued",
        "at": "2026-10-22T08:05:00"
      },
      {
        "status": "processing",
        "at": "2026-10-22T08:06:00"
      },
      {
        "status": "completed",
        "at": "2026-10-22T08:20:00"
      }
    ],
    "materials": [
      {
        "id": "mat-def-17",
        "name": "INSP-6_001.jpg",
        "url": "/images/inspect/def-17.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Выбоина",
              "severity": "medium",
              "bbox": {
                "x": 2,
                "y": 56,
                "w": 96,
                "h": 42
              },
              "confidence": 84,
              "location": "пр. Ленина, 45",
              "recommendation": "Локальный ремонт покрытия."
            }
          ]
        }
      },
      {
        "id": "mat-def-18",
        "name": "INSP-6_002.jpg",
        "url": "/images/inspect/def-18.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Износ разметки",
              "severity": "low",
              "bbox": {
                "x": 16,
                "y": 6,
                "w": 70,
                "h": 58
              },
              "confidence": 77,
              "location": "пр. Ленина, перекрёсток",
              "recommendation": "Устранено: нанесение разметки."
            }
          ]
        }
      }
    ],
    "savedDefectIds": [
      "def-17",
      "def-18"
    ]
  },
  {
    "id": "insp-7",
    "title": "Плановое обследование — путепровод на ул. Профсоюзная",
    "objectId": "obj-3",
    "date": "2026-10-20",
    "source": "drone",
    "operator": "БПЛА-бригада №1",
    "coverage": "320 м",
    "description": "Плановое обследование по графику мониторинга. Снимки размечены модулем анализа.",
    "status": "completed",
    "createdAt": "2026-10-20T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-10-20T08:00:00"
      },
      {
        "status": "queued",
        "at": "2026-10-20T08:05:00"
      },
      {
        "status": "processing",
        "at": "2026-10-20T08:06:00"
      },
      {
        "status": "completed",
        "at": "2026-10-20T08:20:00"
      }
    ],
    "materials": [
      {
        "id": "mat-def-14",
        "name": "INSP-7_001.jpg",
        "url": "/images/inspect/def-14.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Выкрашивание бетона",
              "severity": "low",
              "bbox": {
                "x": 2,
                "y": 45,
                "w": 96,
                "h": 50
              },
              "confidence": 82,
              "location": "Пролёт 1",
              "recommendation": "Косметический ремонт."
            }
          ]
        }
      },
      {
        "id": "mat-def-15",
        "name": "INSP-7_002.jpg",
        "url": "/images/inspect/def-15.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Коррозия перильного ограждения",
              "severity": "low",
              "bbox": {
                "x": 2,
                "y": 26,
                "w": 96,
                "h": 34
              },
              "confidence": 79,
              "location": "Пролёт 2",
              "recommendation": "Устранено: зачистка и антикоррозийная окраска ограждения."
            }
          ]
        }
      }
    ],
    "savedDefectIds": [
      "def-14",
      "def-15"
    ]
  },
  {
    "id": "insp-8",
    "title": "Плановое обследование — А-121 «Сортавала»",
    "objectId": "obj-6",
    "date": "2026-10-16",
    "source": "mobile",
    "operator": "Мобильный комплекс А-1",
    "coverage": "62 км",
    "description": "Плановое обследование по графику мониторинга. Снимки размечены модулем анализа.",
    "status": "completed",
    "createdAt": "2026-10-16T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-10-16T08:00:00"
      },
      {
        "status": "queued",
        "at": "2026-10-16T08:05:00"
      },
      {
        "status": "processing",
        "at": "2026-10-16T08:06:00"
      },
      {
        "status": "completed",
        "at": "2026-10-16T08:20:00"
      }
    ],
    "materials": [
      {
        "id": "mat-def-16",
        "name": "INSP-8_001.jpg",
        "url": "/images/inspect/def-16.jpg",
        "analysis": {
          "state": "matched",
          "engine": "demo-annotations",
          "detections": [
            {
              "type": "Выкрашивание асфальтобетона",
              "severity": "low",
              "bbox": {
                "x": 14,
                "y": 16,
                "w": 72,
                "h": 66
              },
              "confidence": 80,
              "location": "км 40",
              "recommendation": "Поверхностная обработка до образования выбоины."
            }
          ]
        }
      }
    ],
    "savedDefectIds": [
      "def-16"
    ]
  },
  {
    "id": "insp-21",
    "title": "Повторное обследование — пр. Ленина",
    "objectId": "obj-8",
    "date": "2026-09-02",
    "source": "mobile",
    "operator": "Мобильный комплекс А-2",
    "coverage": "12 км",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-09-02T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-09-02T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-09-02T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-12",
    "title": "Повторное обследование — М-4 «Дон», км 320–360",
    "objectId": "obj-2",
    "date": "2026-08-26",
    "source": "mobile",
    "operator": "Мобильный комплекс А-1",
    "coverage": "40 км",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-08-26T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-08-26T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-08-26T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-19",
    "title": "Повторное обследование — эстакада «Южный обход»",
    "objectId": "obj-7",
    "date": "2026-08-19",
    "source": "sensor",
    "operator": "Сеть сенсоров SI-540",
    "coverage": "непрерывный мониторинг",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-08-19T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-08-19T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-08-19T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-10",
    "title": "Повторное обследование — мост через р. Волга",
    "objectId": "obj-1",
    "date": "2026-08-11",
    "source": "drone",
    "operator": "БПЛА-бригада №2",
    "coverage": "100% пролётов",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-08-11T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-08-11T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-08-11T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-15",
    "title": "Повторное обследование — ЗСД",
    "objectId": "obj-4",
    "date": "2026-08-05",
    "source": "drone",
    "operator": "БПЛА-бригада №1",
    "coverage": "46,6 км",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-08-05T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-08-05T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-08-05T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-17",
    "title": "Повторное обследование — А-121 «Сортавала»",
    "objectId": "obj-6",
    "date": "2026-07-22",
    "source": "mobile",
    "operator": "Мобильный комплекс А-1",
    "coverage": "62 км",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-07-22T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-07-22T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-07-22T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-13",
    "title": "Повторное обследование — путепровод на ул. Профсоюзная",
    "objectId": "obj-3",
    "date": "2026-07-09",
    "source": "drone",
    "operator": "БПЛА-бригада №1",
    "coverage": "320 м",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-07-09T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-07-09T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-07-09T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-20",
    "title": "Повторное обследование — пр. Ленина",
    "objectId": "obj-8",
    "date": "2026-06-24",
    "source": "mobile",
    "operator": "Мобильный комплекс А-2",
    "coverage": "12 км",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-06-24T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-06-24T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-06-24T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-16",
    "title": "Повторное обследование — мост через р. Кама",
    "objectId": "obj-5",
    "date": "2026-06-17",
    "source": "drone",
    "operator": "БПЛА-бригада №2",
    "coverage": "100% пролётов",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-06-17T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-06-17T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-06-17T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-11",
    "title": "Повторное обследование — М-4 «Дон», км 320–360",
    "objectId": "obj-2",
    "date": "2026-06-03",
    "source": "mobile",
    "operator": "Мобильный комплекс А-1",
    "coverage": "40 км",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-06-03T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-06-03T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-06-03T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-14",
    "title": "Повторное обследование — ЗСД",
    "objectId": "obj-4",
    "date": "2026-05-27",
    "source": "drone",
    "operator": "БПЛА-бригада №1",
    "coverage": "46,6 км",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-05-27T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-05-27T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-05-27T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-18",
    "title": "Повторное обследование — эстакада «Южный обход»",
    "objectId": "obj-7",
    "date": "2026-05-20",
    "source": "sensor",
    "operator": "Сеть сенсоров SI-540",
    "coverage": "непрерывный мониторинг",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-05-20T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-05-20T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-05-20T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  },
  {
    "id": "insp-9",
    "title": "Повторное обследование — мост через р. Волга",
    "objectId": "obj-1",
    "date": "2026-05-14",
    "source": "drone",
    "operator": "БПЛА-бригада №2",
    "coverage": "100% пролётов",
    "description": "Контрольное обследование по графику. Новых дефектов не выявлено; исходные снимки хранятся в архиве обследований.",
    "status": "completed",
    "createdAt": "2026-05-14T08:00:00",
    "statusLog": [
      {
        "status": "created",
        "at": "2026-05-14T08:00:00"
      },
      {
        "status": "completed",
        "at": "2026-05-14T12:00:00"
      }
    ],
    "materials": [],
    "savedDefectIds": []
  }
],
  defects: [
  {
    "id": "def-1",
    "objectId": "obj-1",
    "inspectionId": "insp-1",
    "type": "Коррозия арматуры",
    "severity": "critical",
    "status": "new",
    "detectedAt": "2026-10-30",
    "location": "Опора №4, нижний пояс",
    "confidence": 96,
    "source": "drone",
    "recommendation": "Немедленное обследование опоры, ограничение нагрузки.",
    "image": "/images/inspect/def-1.jpg",
    "bbox": {
      "x": 12,
      "y": 14,
      "w": 76,
      "h": 58
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-30T09:00:00"
      }
    ]
  },
  {
    "id": "def-2",
    "objectId": "obj-1",
    "inspectionId": "insp-1",
    "type": "Трещина в пролётном строении",
    "severity": "critical",
    "status": "in_progress",
    "detectedAt": "2026-10-30",
    "location": "Пролёт 7, балка Б-2",
    "confidence": 92,
    "source": "drone",
    "recommendation": "Установка маяков, мониторинг раскрытия, ремонт в течение 30 дней.",
    "image": "/images/inspect/def-2.jpg",
    "bbox": {
      "x": 38,
      "y": 18,
      "w": 32,
      "h": 40
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-30T09:00:00"
      },
      {
        "status": "in_progress",
        "at": "2026-11-01T10:30:00"
      }
    ]
  },
  {
    "id": "def-3",
    "objectId": "obj-1",
    "inspectionId": "insp-1",
    "type": "Разрушение деформационного шва",
    "severity": "medium",
    "status": "new",
    "detectedAt": "2026-10-30",
    "location": "Пролёт 3",
    "confidence": 88,
    "source": "drone",
    "recommendation": "Плановая замена шва при ближайшем ремонте.",
    "image": "/images/inspect/def-3.jpg",
    "bbox": {
      "x": 22,
      "y": 38,
      "w": 76,
      "h": 30
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-30T09:00:00"
      }
    ]
  },
  {
    "id": "def-4",
    "objectId": "obj-2",
    "inspectionId": "insp-2",
    "type": "Выбоина",
    "severity": "critical",
    "status": "new",
    "detectedAt": "2026-10-27",
    "location": "км 334, правая полоса",
    "confidence": 94,
    "source": "mobile",
    "recommendation": "Аварийная заделка, риск повреждения ТС.",
    "image": "/images/inspect/def-4.jpg",
    "bbox": {
      "x": 24,
      "y": 32,
      "w": 50,
      "h": 52
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-27T09:00:00"
      }
    ]
  },
  {
    "id": "def-5",
    "objectId": "obj-2",
    "inspectionId": "insp-2",
    "type": "Выбоина с разрушением кромок",
    "severity": "medium",
    "status": "in_progress",
    "detectedAt": "2026-10-27",
    "location": "км 341–345",
    "confidence": 90,
    "source": "mobile",
    "recommendation": "Вырубка, подгрунтовка и заполнение горячей асфальтобетонной смесью.",
    "image": "/images/inspect/def-5.jpg",
    "bbox": {
      "x": 0,
      "y": 15,
      "w": 45,
      "h": 58
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-27T09:00:00"
      },
      {
        "status": "in_progress",
        "at": "2026-10-29T10:30:00"
      }
    ]
  },
  {
    "id": "def-6",
    "objectId": "obj-2",
    "inspectionId": "insp-2",
    "type": "Сетка трещин",
    "severity": "low",
    "status": "new",
    "detectedAt": "2026-10-27",
    "location": "км 350, обочина",
    "confidence": 83,
    "source": "mobile",
    "recommendation": "Поверхностная обработка, наблюдение.",
    "image": "/images/inspect/def-6.jpg",
    "bbox": {
      "x": 2,
      "y": 14,
      "w": 94,
      "h": 56
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-27T09:00:00"
      }
    ]
  },
  {
    "id": "def-7",
    "objectId": "obj-4",
    "inspectionId": "insp-3",
    "type": "Выбоина",
    "severity": "critical",
    "status": "new",
    "detectedAt": "2026-10-24",
    "location": "км 18, съезд",
    "confidence": 91,
    "source": "drone",
    "recommendation": "Аварийная заделка в течение 48 часов.",
    "image": "/images/inspect/def-7.jpg",
    "bbox": {
      "x": 30,
      "y": 40,
      "w": 45,
      "h": 44
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-24T09:00:00"
      }
    ]
  },
  {
    "id": "def-8",
    "objectId": "obj-4",
    "inspectionId": "insp-3",
    "type": "Продольная трещина",
    "severity": "medium",
    "status": "resolved",
    "detectedAt": "2026-10-24",
    "location": "км 22",
    "confidence": 87,
    "source": "drone",
    "recommendation": "Устранено: герметизация трещины.",
    "image": "/images/inspect/def-8.jpg",
    "bbox": {
      "x": 22,
      "y": 10,
      "w": 62,
      "h": 78
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-24T09:00:00"
      },
      {
        "status": "in_progress",
        "at": "2026-10-26T10:30:00"
      },
      {
        "status": "resolved",
        "at": "2026-10-28T16:00:00"
      }
    ]
  },
  {
    "id": "def-9",
    "objectId": "obj-5",
    "inspectionId": "insp-5",
    "type": "Коррозия металлоконструкций",
    "severity": "critical",
    "status": "new",
    "detectedAt": "2026-10-28",
    "location": "Опора №2",
    "confidence": 95,
    "source": "drone",
    "recommendation": "Зачистка, оценка потери сечения, антикоррозийная защита.",
    "image": "/images/inspect/def-9.jpg",
    "bbox": {
      "x": 8,
      "y": 8,
      "w": 84,
      "h": 80
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-28T09:00:00"
      }
    ]
  },
  {
    "id": "def-10",
    "objectId": "obj-5",
    "inspectionId": "insp-5",
    "type": "Деформация пролёта",
    "severity": "critical",
    "status": "in_progress",
    "detectedAt": "2026-10-28",
    "location": "Пролёт 5",
    "confidence": 89,
    "source": "drone",
    "recommendation": "Геодезический мониторинг, ограничение движения большегрузов.",
    "image": "/images/inspect/def-10.jpg",
    "bbox": {
      "x": 22,
      "y": 14,
      "w": 54,
      "h": 74
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-28T09:00:00"
      },
      {
        "status": "in_progress",
        "at": "2026-10-30T10:30:00"
      }
    ]
  },
  {
    "id": "def-11",
    "objectId": "obj-5",
    "inspectionId": "insp-5",
    "type": "Выкрашивание бетона",
    "severity": "medium",
    "status": "new",
    "detectedAt": "2026-10-28",
    "location": "Опора №6",
    "confidence": 85,
    "source": "drone",
    "recommendation": "Ремонт защитного слоя бетона.",
    "image": "/images/inspect/def-11.jpg",
    "bbox": {
      "x": 36,
      "y": 5,
      "w": 28,
      "h": 90
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-28T09:00:00"
      }
    ]
  },
  {
    "id": "def-12",
    "objectId": "obj-7",
    "inspectionId": "insp-4",
    "type": "Просадка опоры",
    "severity": "critical",
    "status": "new",
    "detectedAt": "2026-10-23",
    "location": "Опора №3",
    "confidence": 90,
    "source": "sensor",
    "recommendation": "Инструментальное обследование фундамента.",
    "image": "/images/inspect/def-12.jpg",
    "bbox": {
      "x": 20,
      "y": 8,
      "w": 30,
      "h": 80
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-23T09:00:00"
      }
    ]
  },
  {
    "id": "def-13",
    "objectId": "obj-7",
    "inspectionId": "insp-4",
    "type": "Трещина",
    "severity": "medium",
    "status": "in_progress",
    "detectedAt": "2026-10-23",
    "location": "Пролёт 2",
    "confidence": 86,
    "source": "sensor",
    "recommendation": "Мониторинг, ремонт при плановом обслуживании.",
    "image": "/images/inspect/def-13.jpg",
    "bbox": {
      "x": 20,
      "y": 10,
      "w": 46,
      "h": 76
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-23T09:00:00"
      },
      {
        "status": "in_progress",
        "at": "2026-10-25T10:30:00"
      }
    ]
  },
  {
    "id": "def-14",
    "objectId": "obj-3",
    "inspectionId": "insp-7",
    "type": "Выкрашивание бетона",
    "severity": "low",
    "status": "new",
    "detectedAt": "2026-10-20",
    "location": "Пролёт 1",
    "confidence": 82,
    "source": "drone",
    "recommendation": "Косметический ремонт.",
    "image": "/images/inspect/def-14.jpg",
    "bbox": {
      "x": 2,
      "y": 45,
      "w": 96,
      "h": 50
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-20T09:00:00"
      }
    ]
  },
  {
    "id": "def-15",
    "objectId": "obj-3",
    "inspectionId": "insp-7",
    "type": "Коррозия перильного ограждения",
    "severity": "low",
    "status": "resolved",
    "detectedAt": "2026-10-20",
    "location": "Пролёт 2",
    "confidence": 79,
    "source": "drone",
    "recommendation": "Устранено: зачистка и антикоррозийная окраска ограждения.",
    "image": "/images/inspect/def-15.jpg",
    "bbox": {
      "x": 2,
      "y": 26,
      "w": 96,
      "h": 34
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-20T09:00:00"
      },
      {
        "status": "in_progress",
        "at": "2026-10-22T10:30:00"
      },
      {
        "status": "resolved",
        "at": "2026-10-24T16:00:00"
      }
    ]
  },
  {
    "id": "def-16",
    "objectId": "obj-6",
    "inspectionId": "insp-8",
    "type": "Выкрашивание асфальтобетона",
    "severity": "low",
    "status": "new",
    "detectedAt": "2026-10-16",
    "location": "км 40",
    "confidence": 80,
    "source": "mobile",
    "recommendation": "Поверхностная обработка до образования выбоины.",
    "image": "/images/inspect/def-16.jpg",
    "bbox": {
      "x": 14,
      "y": 16,
      "w": 72,
      "h": 66
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-16T09:00:00"
      }
    ]
  },
  {
    "id": "def-17",
    "objectId": "obj-8",
    "inspectionId": "insp-6",
    "type": "Выбоина",
    "severity": "medium",
    "status": "in_progress",
    "detectedAt": "2026-10-22",
    "location": "пр. Ленина, 45",
    "confidence": 84,
    "source": "mobile",
    "recommendation": "Локальный ремонт покрытия.",
    "image": "/images/inspect/def-17.jpg",
    "bbox": {
      "x": 2,
      "y": 56,
      "w": 96,
      "h": 42
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-22T09:00:00"
      },
      {
        "status": "in_progress",
        "at": "2026-10-24T10:30:00"
      }
    ]
  },
  {
    "id": "def-18",
    "objectId": "obj-8",
    "inspectionId": "insp-6",
    "type": "Износ разметки",
    "severity": "low",
    "status": "resolved",
    "detectedAt": "2026-10-22",
    "location": "пр. Ленина, перекрёсток",
    "confidence": 77,
    "source": "mobile",
    "recommendation": "Устранено: нанесение разметки.",
    "image": "/images/inspect/def-18.jpg",
    "bbox": {
      "x": 16,
      "y": 6,
      "w": 70,
      "h": 58
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-22T09:00:00"
      },
      {
        "status": "in_progress",
        "at": "2026-10-24T10:30:00"
      },
      {
        "status": "resolved",
        "at": "2026-10-26T16:00:00"
      }
    ]
  },
  {
    "id": "def-19",
    "objectId": "obj-6",
    "inspectionId": "insp-22",
    "type": "Лёд / вода в колее",
    "severity": "low",
    "status": "new",
    "detectedAt": "2026-10-31",
    "location": "км 40+350, левая колея",
    "confidence": 86,
    "source": "drone",
    "recommendation": "Наблюдение; противогололёдная обработка, при повторении — выравнивание колеи.",
    "image": "/demo-samples/a121-video-025.jpg",
    "bbox": {
      "x": 36,
      "y": 41,
      "w": 7,
      "h": 18
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-31T10:30:00"
      }
    ]
  },
  {
    "id": "def-20",
    "objectId": "obj-6",
    "inspectionId": "insp-22",
    "type": "Лёд / вода в колее",
    "severity": "low",
    "status": "new",
    "detectedAt": "2026-10-31",
    "location": "км 40+350, правая колея",
    "confidence": 81,
    "source": "drone",
    "recommendation": "Наблюдение; противогололёдная обработка.",
    "image": "/demo-samples/a121-video-025.jpg",
    "bbox": {
      "x": 57,
      "y": 43,
      "w": 3,
      "h": 11
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-31T10:30:00"
      }
    ]
  },
  {
    "id": "def-21",
    "objectId": "obj-6",
    "inspectionId": "insp-22",
    "type": "Выбоина с водой",
    "severity": "medium",
    "status": "new",
    "detectedAt": "2026-10-31",
    "location": "км 40+900, ось проезжей части",
    "confidence": 89,
    "source": "drone",
    "recommendation": "Ямочный ремонт после схода воды; проверить водоотвод участка.",
    "image": "/demo-samples/a121-video-125.jpg",
    "bbox": {
      "x": 50,
      "y": 22,
      "w": 6,
      "h": 18
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-31T10:30:00"
      }
    ]
  },
  {
    "id": "def-22",
    "objectId": "obj-6",
    "inspectionId": "insp-22",
    "type": "Вода в колее",
    "severity": "medium",
    "status": "new",
    "detectedAt": "2026-10-31",
    "location": "км 41+400, правая полоса",
    "confidence": 88,
    "source": "drone",
    "recommendation": "Обследование колейности, восстановление поперечного профиля и водоотвода.",
    "image": "/demo-samples/a121-video-225.jpg",
    "bbox": {
      "x": 55,
      "y": 53,
      "w": 13,
      "h": 40
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-31T10:30:00"
      }
    ]
  },
  {
    "id": "def-23",
    "objectId": "obj-6",
    "inspectionId": "insp-22",
    "type": "Выбоины",
    "severity": "low",
    "status": "new",
    "detectedAt": "2026-10-31",
    "location": "км 41+430, правая полоса",
    "confidence": 79,
    "source": "drone",
    "recommendation": "Включить в план ямочного ремонта.",
    "image": "/demo-samples/a121-video-225.jpg",
    "bbox": {
      "x": 61,
      "y": 37,
      "w": 15,
      "h": 8
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-31T10:30:00"
      }
    ]
  },
  {
    "id": "def-24",
    "objectId": "obj-6",
    "inspectionId": "insp-22",
    "type": "Разрушение кромки покрытия",
    "severity": "medium",
    "status": "new",
    "detectedAt": "2026-10-31",
    "location": "км 41+700, правая кромка",
    "confidence": 87,
    "source": "drone",
    "recommendation": "Восстановление кромки и укрепление обочины.",
    "image": "/demo-samples/a121-video-275.jpg",
    "bbox": {
      "x": 74,
      "y": 27,
      "w": 5,
      "h": 31
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-31T10:30:00"
      }
    ]
  },
  {
    "id": "def-25",
    "objectId": "obj-6",
    "inspectionId": "insp-22",
    "type": "Выбоина",
    "severity": "low",
    "status": "new",
    "detectedAt": "2026-10-31",
    "location": "км 41+720, у правой кромки",
    "confidence": 77,
    "source": "drone",
    "recommendation": "Включить в план ямочного ремонта.",
    "image": "/demo-samples/a121-video-275.jpg",
    "bbox": {
      "x": 72.5,
      "y": 43,
      "w": 3,
      "h": 3
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-31T10:30:00"
      }
    ]
  },
  {
    "id": "def-26",
    "objectId": "obj-6",
    "inspectionId": "insp-22",
    "type": "Выбоины",
    "severity": "low",
    "status": "new",
    "detectedAt": "2026-10-31",
    "location": "км 41+680, правая полоса",
    "confidence": 80,
    "source": "drone",
    "recommendation": "Включить в план ямочного ремонта.",
    "image": "/demo-samples/a121-video-275.jpg",
    "bbox": {
      "x": 69,
      "y": 80,
      "w": 15,
      "h": 8
    },
    "history": [
      {
        "status": "new",
        "at": "2026-10-31T10:30:00"
      }
    ]
  }
],
  alerts: [
  {
    "id": "al-7",
    "objectId": "obj-6",
    "defectId": "def-21",
    "message": "Видеообследование А-121 «Сортавала»: выявлено 8 повреждений покрытия, в том числе выбоина с водой на км 40+900",
    "severity": "medium",
    "createdAt": "2026-10-31T10:35:00",
    "read": false
  },
  {
    "id": "al-1",
    "objectId": "obj-1",
    "defectId": "def-1",
    "message": "Критическая коррозия арматуры на опоре №4 моста через р. Волга",
    "severity": "critical",
    "createdAt": "2026-10-30T09:14:00",
    "read": false
  },
  {
    "id": "al-2",
    "objectId": "obj-5",
    "defectId": "def-9",
    "message": "Коррозия металлоконструкций на опоре №2 моста через р. Кама",
    "severity": "critical",
    "createdAt": "2026-10-28T14:32:00",
    "read": false
  },
  {
    "id": "al-3",
    "objectId": "obj-2",
    "defectId": "def-4",
    "message": "Опасная выбоина на М-4 «Дон», км 334, правая полоса",
    "severity": "critical",
    "createdAt": "2026-10-27T11:05:00",
    "read": false
  },
  {
    "id": "al-4",
    "objectId": "obj-7",
    "defectId": "def-12",
    "message": "Зафиксирована просадка опоры №3 эстакады «Южный обход»",
    "severity": "critical",
    "createdAt": "2026-10-23T08:41:00",
    "read": true
  },
  {
    "id": "al-5",
    "objectId": "obj-4",
    "defectId": "def-7",
    "message": "Выбоина на съезде ЗСД, км 18 — риск для транспорта",
    "severity": "critical",
    "createdAt": "2026-10-24T16:20:00",
    "read": true
  },
  {
    "id": "al-6",
    "objectId": "obj-1",
    "defectId": "def-2",
    "message": "Развитие трещины в пролётном строении моста через р. Волга",
    "severity": "medium",
    "createdAt": "2026-10-30T09:15:00",
    "read": true
  }
],
  reports: [
  {
    "id": "rep-1",
    "number": "SI-2026-0001",
    "title": "Состояние моста через р. Волга — октябрь 2026",
    "objectId": "obj-1",
    "inspectionId": null,
    "type": "Состояние",
    "period": "Октябрь 2026",
    "createdAt": "2026-10-30"
  },
  {
    "id": "rep-2",
    "number": "SI-2026-0002",
    "title": "Прогноз износа по мостовым сооружениям",
    "objectId": null,
    "inspectionId": null,
    "type": "Прогноз износа",
    "period": "II полугодие 2026",
    "createdAt": "2026-10-26"
  },
  {
    "id": "rep-3",
    "number": "SI-2026-0003",
    "title": "Сводный отчёт по всем объектам",
    "objectId": null,
    "inspectionId": null,
    "type": "Сводный",
    "period": "Сентябрь 2026",
    "createdAt": "2026-10-23"
  },
  {
    "id": "rep-4",
    "number": "SI-2026-0004",
    "title": "Инспекция М-4 «Дон», км 320–360",
    "objectId": "obj-2",
    "inspectionId": "insp-2",
    "type": "Инспекция",
    "period": "27.10.2026",
    "createdAt": "2026-10-27"
  },
  {
    "id": "rep-5",
    "number": "SI-2026-0005",
    "title": "Состояние ЗСД — октябрь 2026",
    "objectId": "obj-4",
    "inspectionId": null,
    "type": "Состояние",
    "period": "Октябрь 2026",
    "createdAt": "2026-10-24"
  }
],
};

/** Fresh deep copy of the demo dataset. */
export function createSeed(): DemoState {
  return { version: DEMO_SEED_VERSION, ...structuredClone(seed) };
}
