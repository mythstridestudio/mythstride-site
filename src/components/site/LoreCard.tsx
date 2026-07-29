import type { ReactNode } from "react";

type LoreCardProps = {
  number: string;
  title: string;
  body: string;
  icon: ReactNode;
};

export function LoreCard({ number, title, body, icon }: LoreCardProps) {
  return (
    <article className="lore-card">
      <span className="lore-card__number">{number}</span>
      <span className="lore-card__icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}
