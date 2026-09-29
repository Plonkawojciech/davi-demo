# davi-demo

Demo nowej e-hurtowni B2B dla P.H. DAVI Sp. z o.o. (Gostyń; hurtownia kosmetyków i chemii gospodarczej, importer
marek hiszpańskich). Next.js 16 + Payload CMS 3 (SQLite) w jednej aplikacji: front i panel `/admin`.

- Dev: `pnpm dev` (port 3013). Seed: `pnpm seed` (pomija, gdy dane już są; `--force` dokłada).
- **Zakres celowo mały — to demo, nie migracja.** Strona główna, katalog (filtr marka/kategoria), karta produktu,
  strony marek, zamówienie hurtowe (lista → formularz → panel), wniosek o konto B2B, współpraca, kontakt.
  Dane: 8 marek, 7 kategorii, ~40 produktów z indeksami i zdjęciami z davi.com.pl.
- **Ceny hurtowe nie są pokazywane** (jak dziś u klienta: po zalogowaniu). Demo nie wymyśla cen ani liczb.
- Kolekcje: `src/collections/*` (Produkty, Marki, Kategorie, Zamówienia hurtowe, Wnioski B2B, Wiadomości, Media,
  Użytkownicy) + global `Ustawienia strony` (warunki współpracy, działy, kontakt).
- Zdjęcia: hotlink z davi.com.pl (`imageUrl`); po wdrożeniu pole `image` (upload) ma pierwszeństwo.
- Design: `docs/plan-demo.md`. System w `src/app/(site)/globals.css` (Manrope, granat #1B2570, koral na akcjach).
- Zmiana schematu: `pnpm exec payload migrate:create <nazwa>`, commit `src/migrations/`. `push: false`.
- Deploy: Coolify (projekt `davi-demo`, Dockerfile), domena `davi.programo.pl`, wolumen `/data`.
- Panel demo: `demo@davi.com.pl` / `davi2026`.
