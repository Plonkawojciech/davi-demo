# Demo DAVI — plan (2026-09-29)

Klient: P.H. DAVI Sp. z o.o., Czachorowo 46, 63-800 Gostyń. Hurtownia kosmetyków i chemii gospodarczej,
importer hiszpańskich marek (Instituto Español, Saphir, Asevi, Flor de Mayo, La Casa de los Aromas, Maxi Power).
Obecnie: PrestaShop „System B2B – E-Hurtownia”, 5291 pozycji, ceny po zalogowaniu, bez płatności online.
Kontakt: Katarzyna Wesołek (katarzyna_wesolek@davi.pl), tel. 661 947 223, b2b@davi.com.pl.
Notatka z rozmowy (17.09): wysłać demo do Katarzyny Wesołek, zadzwonić po tygodniu.

## Co pokazuje demo
- Katalog B2B, który sprzedaje marki, a nie tylko listuje SKU: strona marki z historią, kategorie, nowości.
- Karta produktu z indeksem (SKU), pojemnością i przyciskiem „Dodaj do zamówienia”. Ceny hurtowe po zalogowaniu —
  tak jak dziś; demo nie wymyśla cen.
- Zamówienie hurtowe: lista pozycji z ilościami → formularz z NIP-em → wpis w panelu (kolekcja Zamówienia).
- Wniosek o konto B2B (kolekcja Wnioski) — dziś ukryte za „Zaloguj się”.
- Panel: marki, kategorie, produkty, zamówienia, wnioski, ustawienia — bez PrestaShop.

## Decyzje projektowe
- Marka: granat z logo DAVI (#1B2570) jako kolor firmowy; tło porcelanowe #F4F5F8; akcent koralowy #E4573D
  tylko na przyciskach akcji; tekst #12152B; szary #6B7185.
- Jeden krój: Manrope (geometryczny, czytelny w tabelach B2B), skala 13/15/17/22/30/44/64.
- Zdjęcia produktów: hotlink z davi.com.pl (large_default), tło białe, siatka katalogowa 4 kolumny.
- Element wyróżniający: pasek marek w hero z krajem pochodzenia i rokiem założenia (dane ze strony klienta),
  zamiast kafelków z ikonami.
- Zero emoji, zero zmyślonych cen. Liczba „5291 pozycji” pochodzi z listingu klienta.

## Zakres techniczny
Next.js 16 + Payload 3 (SQLite). Kolekcje: Marki, Kategorie, Produkty, Zamówienia, Wnioski B2B, Media, Użytkownicy;
global Ustawienia. Strony: /, /produkty (+ filtr marki/kategorii), /produkt/[slug], /marki, /marki/[slug],
/zamowienie, /konto-b2b, /kontakt. Panel: /admin (demo@davi.com.pl / davi2026).
