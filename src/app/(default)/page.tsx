import Image from "next/image";
import Link from "next/link";
import { localePath } from "@/lib/locales";

export default function LocaleChooserPage() {
  return (
    <main className="locale-gateway">
      <div className="locale-gateway__panel">
        <Image
          src="/images/optimized/app-icon.webp"
          width={88}
          height={88}
          alt=""
          priority
        />
        <p className="section-eyebrow">MythStride</p>
        <h1>Escolha seu idioma</h1>
        <p>Choose your language to enter Elyndor.</p>
        <div className="locale-gateway__actions">
          <Link className="button button--primary" href={localePath("pt-BR")}>
            Português (Brasil)
          </Link>
          <Link className="button button--secondary" href={localePath("en")}>
            English
          </Link>
        </div>
      </div>
    </main>
  );
}
