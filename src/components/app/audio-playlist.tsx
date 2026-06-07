"use client";

import { useRef, useState } from "react";
import { Play, Pause, Music2, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/media";

export interface Track {
  id: string;
  order: number;
  title: string;
  src: string;
}

export function AudioPlaylist({
  tracks,
  title,
}: {
  tracks: Track[];
  title?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  if (tracks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhuma faixa disponível.</p>
    );
  }

  function playIndex(i: number) {
    const idx = (i + tracks.length) % tracks.length;
    setCurrent(idx);
    // aguarda o src atualizar
    requestAnimationFrame(() => {
      const el = audioRef.current;
      if (el) {
        el.load();
        el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    });
  }

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center gap-3 border-b p-3">
        <button
          onClick={toggle}
          className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label={playing ? "Pausar" : "Tocar"}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {title ? `${title} · ` : ""}
            {tracks[current]?.title}
          </p>
          <p className="text-xs text-muted-foreground">
            Faixa {current + 1} de {tracks.length}
          </p>
        </div>
        <button
          onClick={() => playIndex(current - 1)}
          className="grid h-9 w-9 place-items-center rounded-md hover:bg-muted"
          aria-label="Anterior"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          onClick={() => playIndex(current + 1)}
          className="grid h-9 w-9 place-items-center rounded-md hover:bg-muted"
          aria-label="Próxima"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={mediaUrl(tracks[current]?.src ?? "")}
        controls
        className="w-full px-3 py-2"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => playIndex(current + 1)}
      />

      <ul className="max-h-72 divide-y overflow-y-auto">
        {tracks.map((t, i) => (
          <li key={t.id}>
            <button
              onClick={() => playIndex(i)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted",
                i === current && "bg-primary/5 font-medium"
              )}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-xs text-muted-foreground">
                {i === current && playing ? (
                  <Pause className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Music2 className="h-3.5 w-3.5" />
                )}
              </span>
              <span className="flex-1 truncate">{t.title}</span>
              <span className="text-xs text-muted-foreground">{i + 1}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
