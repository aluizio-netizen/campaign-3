import { Play, Film, Volume2 } from "lucide-react";
import { SpeakButton } from "@/components/app/speak-button";
import { Badge } from "@/components/ui/badge";

export interface DialogueLine {
  speaker: string;
  en: string;
  pt: string;
}
export interface PhraseItem {
  en: string;
  pt: string;
  tip?: string;
}
export interface VocabItem {
  term: string;
  translation: string;
  example: string;
  pronunciation: string;
  category: string;
}
export interface FalseFriendItem {
  en: string;
  pt: string;
  note: string;
}

export function VocabularyTable({ items }: { items: VocabItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-2 font-medium">Inglês</th>
            <th className="px-4 py-2 font-medium">Português</th>
            <th className="hidden px-4 py-2 font-medium md:table-cell">
              Pronúncia
            </th>
            <th className="px-4 py-2 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((v, i) => (
            <tr key={i} className="align-top">
              <td className="px-4 py-2.5">
                <span className="font-medium">{v.term}</span>
                <p className="text-xs text-muted-foreground">{v.example}</p>
              </td>
              <td className="px-4 py-2.5">{v.translation}</td>
              <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">
                {v.pronunciation}
              </td>
              <td className="px-4 py-2.5 text-right">
                <SpeakButton text={v.term} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DialogueBlock({ lines }: { lines: DialogueLine[] }) {
  return (
    <div className="space-y-3">
      {lines.map((l, i) => (
        <div key={i} className="rounded-lg border bg-card p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              {l.speaker}
            </span>
            <SpeakButton text={l.en} />
          </div>
          <p className="mt-1 font-medium">{l.en}</p>
          <p className="text-sm text-muted-foreground">{l.pt}</p>
        </div>
      ))}
    </div>
  );
}

export function PhraseList({ items }: { items: PhraseItem[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((p, i) => (
        <div key={i} className="rounded-lg border bg-card p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium">{p.en}</p>
            <SpeakButton text={p.en} />
          </div>
          <p className="text-sm text-muted-foreground">{p.pt}</p>
          {p.tip && (
            <p className="mt-1 text-xs text-accent-foreground/80">💡 {p.tip}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function FalseFriends({ items }: { items: FalseFriendItem[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-2">
      {items.map((f, i) => (
        <div
          key={i}
          className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm"
        >
          <p>
            <span className="font-semibold">{f.en}</span>{" "}
            <span className="text-muted-foreground">
              (parece &ldquo;{f.pt}&rdquo;)
            </span>
          </p>
          <p className="mt-0.5 text-muted-foreground">{f.note}</p>
        </div>
      ))}
    </div>
  );
}

export function MissionChecklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((c, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border border-primary/40 text-[10px] text-primary">
            ✓
          </span>
          {c}
        </li>
      ))}
    </ul>
  );
}

/** Placeholder de vídeo da aula — pronto para receber upload/embed futuro. */
export function VideoLessonPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed bg-muted/40 text-muted-foreground">
      <Film className="h-8 w-8" />
      <p className="mt-2 text-sm font-medium">Vídeo da aula</p>
      <p className="text-xs">{title}</p>
      <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs">
        <Play className="h-3 w-3" /> Em breve
      </span>
    </div>
  );
}

/** Placeholder de player de áudio (escuta) — estrutura pronta para TTS/arquivo. */
export function AudioPlayerPlaceholder({
  text,
  label = "Áudio de escuta",
}: {
  text: string;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
        <Volume2 className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{text}</p>
      </div>
      <SpeakButton text={text} label="Reproduzir" />
    </div>
  );
}

export function CategoryBadge({ children }: { children: React.ReactNode }) {
  return <Badge variant="muted">{children}</Badge>;
}
