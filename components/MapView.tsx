"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Map as MlMap, Marker as MlMarker } from "maplibre-gl";
import type { InfraObject, ObjectStatus } from "@/lib/dashboard";
import styles from "./Dashboard.module.css";

const KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
// «dataviz» — светлый минималистичный стиль MapTiler, хорошо подходит под накладку данных.
const STYLE = `https://api.maptiler.com/maps/dataviz/style.json?key=${KEY}`;

const markerColor: Record<ObjectStatus, string> = {
  good: "#1e874b",
  warning: "#f5a623",
  critical: "#c0392b",
};

// Центр и охват РФ по умолчанию.
const RUSSIA_CENTER: [number, number] = [90, 63];
const RUSSIA_ZOOM = 2.3;

interface MapViewProps {
  objects: InfraObject[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function MapView({ objects, activeId, onSelect }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markersRef = useRef<Record<string, { marker: MlMarker; el: HTMLButtonElement }>>({});
  const makeMarkerRef = useRef<((o: InfraObject) => MlMarker) | null>(null);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  // Инициализация карты — один раз.
  useEffect(() => {
    if (!containerRef.current || !KEY) return;
    let cancelled = false;

    import("maplibre-gl").then(({ default: maplibregl }) => {
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: STYLE,
        center: RUSSIA_CENTER,
        zoom: RUSSIA_ZOOM,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

      makeMarkerRef.current = (o) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = styles.mapPin;
        el.style.background = markerColor[o.status];
        el.setAttribute("aria-label", o.name);
        el.title = o.name;
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectRef.current(o.id);
        });
        return new maplibregl.Marker({ element: el }).setLngLat([o.lng, o.lat]).addTo(map);
      };

      mapRef.current = map;
      map.on("load", () => {
        if (!cancelled) setReady(true);
      });
    });

    return () => {
      cancelled = true;
      Object.values(markersRef.current).forEach(({ marker }) => marker.remove());
      markersRef.current = {};
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Синхронизация маркеров с текущим набором объектов (фильтры).
  useEffect(() => {
    if (!ready || !makeMarkerRef.current) return;

    const next = new Set(objects.map((o) => o.id));
    // удалить исчезнувшие
    for (const [id, { marker }] of Object.entries(markersRef.current)) {
      if (!next.has(id)) {
        marker.remove();
        delete markersRef.current[id];
      }
    }
    // добавить новые
    for (const o of objects) {
      if (!markersRef.current[o.id]) {
        const marker = makeMarkerRef.current(o);
        const el = marker.getElement() as HTMLButtonElement;
        markersRef.current[o.id] = { marker, el };
      }
    }
  }, [ready, objects]);

  // Подсветка активного объекта + плавный перелёт.
  useEffect(() => {
    if (!ready) return;
    for (const [id, { el }] of Object.entries(markersRef.current)) {
      el.classList.toggle(styles.mapPinActive, id === activeId);
    }
    const active = objects.find((o) => o.id === activeId);
    if (active && mapRef.current) {
      mapRef.current.flyTo({ center: [active.lng, active.lat], zoom: 6, duration: 900 });
    }
  }, [ready, activeId, objects]);

  if (!KEY) {
    return (
      <div className={styles.mapMissing}>
        <p>
          Карта недоступна: не задан ключ MapTiler.
          <br />
          Добавьте <code>NEXT_PUBLIC_MAPTILER_KEY</code> в переменные окружения.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className={styles.mapCanvas} />;
}
