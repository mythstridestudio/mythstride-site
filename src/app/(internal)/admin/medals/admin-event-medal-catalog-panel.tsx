"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createAdminEventMedal,
  listAdminEvents,
  type AdminEvent,
} from "@/lib/api/admin-events";
import { ApiError } from "@/lib/api/client";

export default function AdminEventMedalCatalogPanel({
  token,
  onCreated,
}: {
  token: string;
  onCreated: () => void;
}) {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [eventSearch, setEventSearch] = useState("");
  const [eventId, setEventId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void listAdminEvents(token).then((list) => {
      if (alive) setEvents(list);
    }).catch(() => {
      if (alive) setError("Não foi possível consultar os eventos para cadastrar uma medalha.");
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [token]);

  const filteredEvents = useMemo(() => {
    const term = eventSearch.trim().toLocaleLowerCase("pt-BR");
    return events.filter((event) => event.nome.toLocaleLowerCase("pt-BR").includes(term))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [events, eventSearch]);
  const selectedEvent = events.find((event) => event.id === eventId);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent || saving || name.trim().length < 3) return;
    const medalName = name.trim();
    const confirmed = window.confirm(
      `CADASTRAR MEDALHA\n\nEvento: ${selectedEvent.nome}\nMedalha: ${medalName}\n\nA medalha será adicionada ao catálogo desse evento, mas não será entregue a jogadores automaticamente. Continuar?`,
    );
    if (!confirmed) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await createAdminEventMedal(token, {
        eventoId: selectedEvent.id,
        internalKey: `admin.event.${selectedEvent.id}.medal`,
        nome: medalName,
        descricao: description.trim() || null,
        imagemUrl: imageUrl.trim() || null,
      });
      setNotice(`Medalha "${medalName}" cadastrada. Agora você pode selecioná-la acima e entregá-la a um jogador.`);
      setName("");
      setDescription("");
      setImageUrl("");
      onCreated();
    } catch (caught) {
      setError(caught instanceof ApiError && caught.status === 409
        ? "Este evento já possui uma medalha. Selecione outro evento; cada evento aceita uma medalha."
        : "A API não conseguiu cadastrar a medalha. Confira os campos e tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="app-panel rpg-card rounded-xl p-5 sm:p-7" aria-labelledby="admin-new-medal-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.20em] text-fiery-orange">Catálogo administrativo</p>
          <h2 id="admin-new-medal-title" className="mt-2 font-display text-xl text-gold-bright">Cadastrar medalha de evento</h2>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            A lista de entrega exibe medalhas já registradas no servidor. Cadastre aqui uma nova medalha
            para qualquer evento existente que ainda não possua uma, inclusive eventos antigos.
          </p>
        </div>
        <button type="button" className="button button--secondary" aria-expanded={showForm}
          onClick={() => setShowForm((open) => !open)}>
          {showForm ? "Fechar cadastro" : "Cadastrar nova medalha"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => void submit(e)} className="mt-5 grid gap-4 border-t border-gold-dim/20 pt-5">
          <label className="grid gap-2 text-xs text-gold-muted">
            Encontrar evento
            <input className="myth-input" type="search" value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)} placeholder="Filtrar eventos pelo nome" />
          </label>
          <label className="grid gap-2 text-xs text-gold-muted">
            Evento
            <select className="myth-input" required value={eventId} disabled={loading || saving}
              onChange={(e) => setEventId(e.target.value)}>
              <option value="">{loading ? "Consultando eventos..." : "Selecione um evento"}</option>
              {filteredEvents.map((event) => (
                <option key={event.id} value={event.id}>{event.nome}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs text-gold-muted">
            Nome da medalha
            <input className="myth-input" value={name} minLength={3} maxLength={160} required
              onChange={(e) => setName(e.target.value)} placeholder="Ex.: Medalha Corrida da Cidade" />
          </label>
          <label className="grid gap-2 text-xs text-gold-muted">
            URL da imagem da medalha (opcional)
            <input className="myth-input" type="url" maxLength={500} value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </label>
          <label className="grid gap-2 text-xs text-gold-muted">
            Descrição (opcional)
            <textarea className="myth-input min-h-24" maxLength={800} value={description}
              onChange={(e) => setDescription(e.target.value)} />
          </label>
          {error && <p role="alert" className="border border-hp-red/40 p-3 text-sm">{error}</p>}
          {notice && <p role="status" className="border border-emerald/30 p-3 text-sm">{notice}</p>}
          <button type="submit" className="button button--primary" disabled={saving || loading || !selectedEvent || name.trim().length < 3}>
            {saving ? "Cadastrando..." : "Salvar medalha no catálogo"}
          </button>
          <p className="text-xs text-text-muted">
            Cada evento tem no máximo uma medalha. O cadastro não publica o evento e não concede conquistas.
            Troféus e conquistas são sistemas separados das medalhas de eventos.
          </p>
        </form>
      )}
    </section>
  );
}
