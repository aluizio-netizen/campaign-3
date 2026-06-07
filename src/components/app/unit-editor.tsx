"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Save,
  Headphones,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { parseJson } from "@/lib/utils";

// ─────────────────────────────── Tipos ─────────────────────────────────────

interface VocabRow {
  term: string;
  translation: string;
  example: string;
  pronunciation: string;
  category: string;
}

export interface EditorTrack {
  id: string;
  order: number;
  title: string;
  src: string;
  unitId: string | null;
}

export interface EditorAlbum {
  id: string;
  title: string;
  kind: string;
  order: number;
  tracks: EditorTrack[];
}

export interface EditorPage {
  id: string;
  order: number;
  src: string;
  unitId: string | null;
}

export interface EditorCollection {
  id: string;
  title: string;
  kind: string;
  order: number;
  pages: EditorPage[];
}

export interface EditorUnit {
  id: string;
  slug: string;
  order: number;
  title: string;
  summary: string;
  objective: string;
  body: string;
  vocab: string;
  durationMin: number;
  published: boolean;
}

type UnitEditorProps =
  | {
      mode: "create";
      unit?: undefined;
      albums?: undefined;
      collections?: undefined;
    }
  | {
      mode: "edit";
      unit: EditorUnit;
      albums: EditorAlbum[];
      collections: EditorCollection[];
    };

// ─────────────────────────────── Helpers ───────────────────────────────────

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptyVocabRow: VocabRow = {
  term: "",
  translation: "",
  example: "",
  pronunciation: "",
  category: "",
};

// ─────────────────────────────── Componente ────────────────────────────────

export function UnitEditor(props: UnitEditorProps) {
  const { mode } = props;
  const router = useRouter();

  const initialUnit = props.unit;

  const [title, setTitle] = useState(initialUnit?.title ?? "");
  const [slug, setSlug] = useState(initialUnit?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialUnit?.slug));
  const [order, setOrder] = useState<string>(
    initialUnit ? String(initialUnit.order) : ""
  );
  const [durationMin, setDurationMin] = useState<string>(
    initialUnit ? String(initialUnit.durationMin) : "20"
  );
  const [summary, setSummary] = useState(initialUnit?.summary ?? "");
  const [objective, setObjective] = useState(initialUnit?.objective ?? "");
  const [body, setBody] = useState(initialUnit?.body ?? "");
  const [published, setPublished] = useState(initialUnit?.published ?? false);
  const [vocab, setVocab] = useState<VocabRow[]>(() =>
    initialUnit ? parseJson<VocabRow[]>(initialUnit.vocab, []) : []
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveSlug = slugTouched ? slug : slugify(title);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  // ── Vocabulário ──────────────────────────────────────────────────────────
  function addVocabRow() {
    setVocab((v) => [...v, { ...emptyVocabRow }]);
  }
  function removeVocabRow(index: number) {
    setVocab((v) => v.filter((_, i) => i !== index));
  }
  function updateVocabRow(index: number, key: keyof VocabRow, value: string) {
    setVocab((v) =>
      v.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  }

  // ── Salvar ─────────────────────────────────────────────────────────────────
  async function handleSave() {
    setError(null);
    if (!title.trim()) {
      setError("Informe um título para a unidade.");
      return;
    }

    const cleanVocab = vocab.filter((row) => row.term.trim() || row.translation.trim());

    const payload = {
      title: title.trim(),
      slug: effectiveSlug || undefined,
      order: order.trim() === "" ? undefined : Number(order),
      durationMin: durationMin.trim() === "" ? undefined : Number(durationMin),
      summary,
      objective,
      body,
      published,
      vocab: JSON.stringify(cleanVocab),
    };

    if (
      payload.order !== undefined &&
      !Number.isFinite(payload.order)
    ) {
      setError("A ordem deve ser um número.");
      return;
    }
    if (
      payload.durationMin !== undefined &&
      !Number.isFinite(payload.durationMin)
    ) {
      setError("A duração deve ser um número.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/units", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json().catch(() => null)) as
          | { ok?: boolean; id?: string; error?: string }
          | null;
        if (!res.ok || !data?.id) {
          setError(data?.error ?? "Não foi possível criar a unidade.");
          return;
        }
        router.push(`/admin/unidades/${data.id}`);
        router.refresh();
      } else {
        const res = await fetch(`/api/admin/units/${initialUnit!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json().catch(() => null)) as
          | { ok?: boolean; error?: string }
          | null;
        if (!res.ok || !data?.ok) {
          setError(data?.error ?? "Não foi possível salvar as alterações.");
          return;
        }
        router.refresh();
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // ── Excluir ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (mode !== "edit") return;
    if (
      !confirm(
        "Excluir esta unidade? As mídias anexadas serão apenas desvinculadas."
      )
    ) {
      return;
    }
    setError(null);
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/units/${initialUnit!.id}`, {
        method: "DELETE",
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Não foi possível excluir a unidade.");
        return;
      }
      router.push("/admin/unidades");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/unidades"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Unidades
      </Link>

      {error && (
        <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* ── Campos principais ── */}
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Nova unidade" : "Dados da unidade"}
          </CardTitle>
          <CardDescription>
            O texto da unidade é autorado por você. Use markdown no conteúdo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Ex.: Apresentações"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={effectiveSlug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="apresentacoes"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="Próxima na sequência"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="durationMin">Duração (min)</Label>
              <Input
                id="durationMin"
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="summary">Resumo</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Breve descrição da unidade."
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="objective">Objetivo</Label>
            <Textarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="O que o aluno vai aprender."
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="body">Conteúdo (markdown)</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Texto autorado da unidade em markdown."
              className="min-h-[280px] font-mono"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <span>Publicada (visível para os alunos)</span>
          </label>
        </CardContent>
      </Card>

      {/* ── Vocabulário ── */}
      <Card>
        <CardHeader>
          <CardTitle>Vocabulário</CardTitle>
          <CardDescription>
            Termos da unidade. Linhas vazias são ignoradas ao salvar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {vocab.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum termo adicionado.
            </p>
          )}
          {vocab.map((row, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-md border p-3 sm:grid-cols-2 lg:grid-cols-5"
            >
              <Input
                value={row.term}
                onChange={(e) => updateVocabRow(index, "term", e.target.value)}
                placeholder="Termo"
              />
              <Input
                value={row.translation}
                onChange={(e) =>
                  updateVocabRow(index, "translation", e.target.value)
                }
                placeholder="Tradução"
              />
              <Input
                value={row.example}
                onChange={(e) =>
                  updateVocabRow(index, "example", e.target.value)
                }
                placeholder="Exemplo"
              />
              <Input
                value={row.pronunciation}
                onChange={(e) =>
                  updateVocabRow(index, "pronunciation", e.target.value)
                }
                placeholder="Pronúncia"
              />
              <div className="flex gap-2">
                <Input
                  value={row.category}
                  onChange={(e) =>
                    updateVocabRow(index, "category", e.target.value)
                  }
                  placeholder="Categoria"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVocabRow(index)}
                  aria-label="Remover termo"
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVocabRow}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" /> Adicionar termo
          </Button>
        </CardContent>
      </Card>

      {/* ── Mídia (somente edição) ── */}
      {mode === "edit" && (
        <MediaManager
          unitId={initialUnit!.id}
          albums={props.albums}
          collections={props.collections}
        />
      )}

      {/* ── Ações ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="gap-1.5"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {mode === "create" ? "Criar unidade" : "Salvar alterações"}
        </Button>

        {mode === "edit" && (
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-1.5"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Excluir unidade
          </Button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────── Mídia ─────────────────────────────────────

function MediaManager({
  unitId,
  albums,
  collections,
}: {
  unitId: string;
  albums: EditorAlbum[];
  collections: EditorCollection[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function postMedia(
    action: "attach" | "detach",
    kind: "track" | "page",
    ids: string[]
  ) {
    if (ids.length === 0) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/units/${unitId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, kind, ids }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Não foi possível atualizar a mídia.");
        return;
      }
      router.refresh();
    } catch {
      setError("Erro de conexão ao atualizar a mídia.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <AudioManager
        unitId={unitId}
        albums={albums}
        busy={busy}
        onAttach={(ids) => postMedia("attach", "track", ids)}
        onDetach={(ids) => postMedia("detach", "track", ids)}
      />

      <PageRangeManager
        unitId={unitId}
        collections={collections}
        busy={busy}
        onAttach={(ids) => postMedia("attach", "page", ids)}
        onDetach={(ids) => postMedia("detach", "page", ids)}
      />
    </div>
  );
}

function AudioManager({
  unitId,
  albums,
  busy,
  onAttach,
  onDetach,
}: {
  unitId: string;
  albums: EditorAlbum[];
  busy: boolean;
  onAttach: (ids: string[]) => void;
  onDetach: (ids: string[]) => void;
}) {
  const attachedTracks = useMemo(
    () =>
      albums.flatMap((a) => a.tracks).filter((t) => t.unitId === unitId),
    [albums, unitId]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="h-4 w-4 text-primary" /> Áudios
        </CardTitle>
        <CardDescription>
          Marque faixas para anexar a esta unidade. Faixas já vinculadas a
          outra unidade aparecem indicadas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {attachedTracks.length > 0 && (
          <div className="rounded-md border bg-muted/30 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Anexadas nesta unidade ({attachedTracks.length})
            </p>
            <ul className="space-y-1.5">
              {attachedTracks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="truncate">{t.title}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => onDetach([t.id])}
                  >
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {albums.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum álbum de áudio importado.
          </p>
        )}

        {albums.map((album) => {
          const available = album.tracks.filter((t) => t.unitId !== unitId);
          if (available.length === 0) return null;
          return (
            <div key={album.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{album.title}</p>
                <Badge variant="muted">{album.kind}</Badge>
              </div>
              <ul className="space-y-1">
                {available.map((t) => {
                  const usedElsewhere = t.unitId !== null;
                  return (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate">{t.title}</span>
                        {usedElsewhere && (
                          <Badge variant="warning">em outra unidade</Badge>
                        )}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() => onAttach([t.id])}
                      >
                        Anexar
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function PageRangeManager({
  unitId,
  collections,
  busy,
  onAttach,
  onDetach,
}: {
  unitId: string;
  collections: EditorCollection[];
  busy: boolean;
  onAttach: (ids: string[]) => void;
  onDetach: (ids: string[]) => void;
}) {
  const [selectedCollection, setSelectedCollection] = useState<string>(
    collections[0]?.id ?? ""
  );
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rangeError, setRangeError] = useState<string | null>(null);

  const attachedPages = useMemo(
    () =>
      collections
        .flatMap((c) =>
          c.pages.map((p) => ({ ...p, collectionTitle: c.title }))
        )
        .filter((p) => p.unitId === unitId)
        .sort((a, b) => a.order - b.order),
    [collections, unitId]
  );

  function handleAttachRange() {
    setRangeError(null);
    const collection = collections.find((c) => c.id === selectedCollection);
    if (!collection) {
      setRangeError("Selecione uma coleção.");
      return;
    }
    const fromN = Number(from);
    const toN = Number(to);
    if (
      from.trim() === "" ||
      to.trim() === "" ||
      !Number.isFinite(fromN) ||
      !Number.isFinite(toN)
    ) {
      setRangeError("Informe o intervalo de páginas (de / até).");
      return;
    }
    const lo = Math.min(fromN, toN);
    const hi = Math.max(fromN, toN);
    const ids = collection.pages
      .filter((p) => p.order >= lo && p.order <= hi)
      .map((p) => p.id);
    if (ids.length === 0) {
      setRangeError("Nenhuma página nesse intervalo.");
      return;
    }
    onAttach(ids);
    setFrom("");
    setTo("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Páginas do livro
        </CardTitle>
        <CardDescription>
          Anexe páginas por intervalo (use o número de ordem da página).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {rangeError && (
          <p className="text-sm text-danger">{rangeError}</p>
        )}

        {collections.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma coleção de páginas importada.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="collection">Coleção</Label>
              <select
                id="collection"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="from">De</Label>
              <Input
                id="from"
                type="number"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-24"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="to">Até</Label>
              <Input
                id="to"
                type="number"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-24"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={handleAttachRange}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" /> Anexar
            </Button>
          </div>
        )}

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Páginas anexadas ({attachedPages.length})
          </p>
          {attachedPages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma página anexada.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {attachedPages.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                >
                  <span className="truncate">
                    <span className="font-mono text-muted-foreground">
                      #{p.order}
                    </span>{" "}
                    {p.collectionTitle} · {p.src}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => onDetach([p.id])}
                  >
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
