"use client";

import { ChangeEvent, useId, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { uploadAdminEventMedia, type EventMediaKind } from "@/lib/api/admin-events";

interface Props {
  accessToken: string;
  kind: EventMediaKind;
  label: string;
  value: string;
  onChange: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

function uploadError(error: unknown): string {
  if (error instanceof ApiError) {
    const body = error.body;
    if (body && typeof body === "object" && "mensagem" in body) {
      return String(body.mensagem);
    }
    if (error.status === 413) return "Arquivo muito grande. O limite é 5 MB.";
    if (error.status === 401 || error.status === 403) {
      return "Sua sessão não tem permissão para enviar imagens.";
    }
  }
  return "Falha no envio. Verifique a conexão e tente novamente.";
}

/**
 * Upload directly to the authenticated .NET API and save only its durable URL
 * in the event form. No image bytes are stored in the site or mobile bundle.
 */
export default function EventImageUploadField({
  accessToken, kind, label, value, onChange, onUploadingChange,
}: Props) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || uploading) return;

    const mimeTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!mimeTypes.includes(file.type) || file.size > 5 * 1024 * 1024 || file.size === 0) {
      setError("Escolha PNG, JPG ou WebP com até 5 MB.");
      return;
    }

    setError(null);
    setUploading(true);
    onUploadingChange(true);
    try {
      const url = await uploadAdminEventMedia(accessToken, kind, file);
      onChange(url);
    } catch (caught) {
      setError(uploadError(caught));
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  };

  return (
    <section className="grid min-w-0 gap-3 rounded-[14px] border border-gold-dim/25 bg-void/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-muted">
          {label}
        </label>
        {value && <span className="text-xs text-emerald">Imagem salva no servidor</span>}
      </div>

      <div className="flex min-h-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gold-dim/30 bg-black/25">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="max-h-52 w-full object-contain" />
        ) : (
          <p className="px-4 text-center text-xs text-text-muted">
            {kind === "medal" ? "Medalha com fundo transparente (PNG recomendado)" : "Prévia da arte do evento"}
          </p>
        )}
      </div>

      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={uploading}
        onChange={(event) => void handleFile(event)}
        className="block w-full cursor-pointer text-xs text-text-secondary file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-gold/40 file:bg-void file:px-3 file:py-2 file:text-gold"
      />
      <p className="text-xs text-text-muted">
        {uploading ? "Enviando e processando imagem..." : "PNG, JPG ou WebP · até 5 MB. A imagem fica hospedada na API."}
      </p>
      {value && !uploading && (
        <button type="button" className="justify-self-start text-xs text-text-muted underline"
          onClick={() => onChange("")}>
          Remover imagem
        </button>
      )}
      {error && <p role="alert" className="text-xs text-hp-red">{error}</p>}
    </section>
  );
}
