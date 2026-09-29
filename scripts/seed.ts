/* Seed demo DAVI — marki, kategorie i produkty (nazwy, indeksy, zdjęcia) pochodzą z davi.com.pl.
   Bez cen: w e-hurtowni klienta ceny widać po zalogowaniu. Zakres celowo mały. */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const D = 'https://davi.com.pl/'

async function main() {
  const payload = await getPayload({ config })
  if ((await payload.count({ collection: 'products' })).totalDocs > 0 && !process.argv.includes('--force')) {
    console.log('[seed] dane już są, pomijam')
    process.exit(0)
  }
  if ((await payload.count({ collection: 'users' })).totalDocs === 0) {
    await payload.create({ collection: 'users', data: { email: 'demo@davi.com.pl', password: 'davi2026', name: 'Obsługa klientów hurtowych' } })
    console.log('[seed] konto demo@davi.com.pl / davi2026')
  }

  const brandDefs = [
    { name: 'Instituto Español', slug: 'instituto-espanol', country: 'Hiszpania', since: 1903, imported: true, featured: true, order: 1, website: 'https://www.institutoespanol.com.pl',
      tagline: 'Pielęgnacja skóry z Sewilli: aloes, mocznik, awokado, kolagen, masło shea.',
      description: 'Producent kosmetyków do pielęgnacji skóry działający nieprzerwanie od 1903 roku, jedna z największych firm tego segmentu w Hiszpanii. Dystrybucja do ponad 20 krajów. Serie Aloe Vera, Urea, Avena, Colágeno, Shea, Atopic i Detox: duże pojemności, sprawdzone formuły, rozsądna cena.',
      imageUrl: D + 'img/cms/nowa/base_blog-copia-1-1534x767.jpg' },
    { name: 'Saphir Parfums', slug: 'saphir', country: 'Hiszpania', since: 1970, imported: true, featured: true, order: 2, website: 'https://www.saphir.com.pl',
      tagline: 'Wody perfumowane z ponad pięćdziesięcioletnią tradycją, w pojemnościach 50 i 200 ml.',
      description: 'Laboratoria Saphir prowadzą cały proces od opracowania kompozycji, przez mieszanie i maceracje, po napełnianie i dystrybucję. Linie Saphir Women i Saphir Men to najczęściej zamawiane perfumy w naszej hurtowni.',
      imageUrl: D + 'img/cms/nowa/062798_8.jpg' },
    { name: 'Asevi', slug: 'asevi', country: 'Hiszpania', imported: true, featured: true, order: 3,
      tagline: 'Chemia gospodarcza Pons Químicas: koncentraty do płukania, podłóg i prania o intensywnym zapachu.',
      description: 'Hiszpańska marka chemii gospodarczej należąca do Pons Químicas. Płyny do płukania, detergenty i środki do podłóg wyróżniają się wydajnością i długotrwałym zapachem. W ofercie także pakiety zbiorcze 10 i 12 sztuk dla sklepów.',
      imageUrl: D + 'img/cms/nowa/767003223_1570562224770583_5772212000920583278_n.jpg' },
    { name: 'Flor de Mayo', slug: 'flor-de-mayo', country: 'Hiszpania', imported: true, featured: true, order: 4, website: 'https://www.flordemayo.pl',
      tagline: 'Rodzinna perfumeria z Walencji: wody perfumowane, kosmetyki do kąpieli i zestawy prezentowe.',
      description: 'Flor de Mayo i La Casa de los Aromas należą do Jesús Gómez S.L., rodzinnej firmy z Walencji założonej w latach 90. Specjaliści od doboru aromatów; produkty obecne w domach w wielu krajach świata.',
      imageUrl: D + 'img/cms/nowa/Conjunto_Wild_Safari_2.jpg' },
    { name: 'La Casa de los Aromas', slug: 'la-casa-de-los-aromas', country: 'Hiszpania', imported: true, featured: true, order: 5, website: 'https://www.lacasadelosaromas.pl',
      tagline: 'Patyczki, olejki i saszetki zapachowe do domu, sklepu i gabinetu.',
      description: 'Marka aromatów do wnętrz: patyczki zapachowe, olejki, odświeżacze, kadzidełka i saszetki. Linie Oh! Happy, Botanic i Mikado. Dobrze rotuje w drogeriach i sklepach z wyposażeniem wnętrz.',
      imageUrl: D + 'img/cms/nowa/Mind&Body_2.jpg' },
    { name: 'Maxi Power', slug: 'maxi-power', country: 'Hiszpania', imported: true, featured: true, order: 6,
      tagline: 'Skoncentrowane płyny do naczyń z pompką i gąbką w zestawie.',
      description: 'Linia skoncentrowanych płynów do mycia naczyń: gęsta formuła, atrakcyjne zapachy, wygodne opakowania z pompką. Ekonomiczny wybór dla klientów hurtowych szukających skutecznej chemii w dobrej cenie.' },
    { name: 'Colorwin', slug: 'colorwin', country: 'Polska', featured: true, order: 7, website: 'https://www.colorwin.pl',
      tagline: 'Retusz odrostów i szampony przeciw siwieniu bez parabenów i ciekłych silikonów.',
      description: 'Produkty do włosów dla kobiet i mężczyzn: spraye do retuszu odrostów, szampony redukujące siwiznę i przeciw wypadaniu. Bez parabenów i ciekłych silikonów, z naciskiem na prostotę użycia.' },
    { name: 'Parafina Bronze', slug: 'parafina-bronze', country: 'Polska', featured: true, order: 8,
      tagline: 'Przyspieszacze opalania, bronzery i samoopalacze na bazie wody.',
      description: 'Kosmetyki do opalania i samoopalania: kremy 3w1 z filtrem SPF, przyspieszacze w wodzie do twarzy i ciała, pianki i krople samoopalające.' },
    { name: 'Gentle Day', slug: 'gentle-day', country: 'Polska', order: 9,
      tagline: 'Ekologiczna higiena intymna: tampony i podpaski z bawełny organicznej, płyny bez SLES.',
      description: 'Produkty higieny intymnej wolne od chloru, substancji zapachowych i parabenów: podpaski i wkładki z paskiem anionowym, tampony ze 100% bawełny ekologicznej, płyny i chusteczki.' },
  ]
  const brands: Record<string, number> = {}
  for (const b of brandDefs) brands[b.slug] = (await payload.create({ collection: 'brands', data: b as any })).id as number
  console.log('[seed] marki:', brandDefs.length)

  const catDefs = [
    ['perfumy', 'Perfumy i wody perfumowane', 'Saphir, Flor de Mayo — damskie i męskie, 20 do 200 ml'],
    ['pielegnacja', 'Pielęgnacja ciała', 'Kremy, balsamy i żele Instituto Español, w tym opakowania rodzinne'],
    ['wlosy', 'Włosy', 'Szampony, retusz odrostów, pielęgnacja dla mężczyzn'],
    ['opalanie', 'Opalanie i samoopalacze', 'Przyspieszacze, bronzery, pianki i krople Parafina Bronze'],
    ['higiena', 'Higiena intymna', 'Ekologiczne tampony, podpaski, wkładki i płyny Gentle Day'],
    ['chemia', 'Chemia gospodarcza', 'Płukanie, pranie, podłogi, naczynia — Asevi i Maxi Power'],
    ['zapachy-do-domu', 'Zapachy do domu', 'Patyczki, olejki i odświeżacze La Casa de los Aromas, świece'],
  ]
  const cats: Record<string, number> = {}
  let ci = 0
  for (const [slug, name, lead] of catDefs) cats[slug] = (await payload.create({ collection: 'categories', data: { slug, name, lead, order: ci++ } })).id as number
  console.log('[seed] kategorie:', catDefs.length)

  type P = [brand: string, cat: string, sku: string, name: string, size: string, img: string, short?: string, flags?: { isNew?: boolean; featured?: boolean; packQty?: number }]
  const products: P[] = [
    ['saphir', 'perfumy', 'SAP-109', 'SAPHIR WOMEN Woda perfumowana NOCHES DE PARIS', '200 ml', '83440-large_default/saphir-women-woda-perfumowana-noches-de-paris-200-ml.jpg', 'Wody perfumowane Saphir Women: przyjemny, długotrwały zapach w dużej, hurtowej pojemności 200 ml.', { featured: true }],
    ['saphir', 'perfumy', 'SAP-127', 'SAPHIR WOMEN Woda perfumowana OCEANYC', '200 ml', '83450-large_default/saphir-women-woda-perfumowana-oceanyc-200-ml.jpg', 'Nowość w linii Saphir Women. Świeża, wodna kompozycja na co dzień.', { isNew: true, featured: true }],
    ['saphir', 'perfumy', 'SAP-107', 'SAPHIR WOMEN Woda perfumowana RUBI', '200 ml', '83439-large_default/saphir-women-woda-perfumowana-rubi-200-ml.jpg'],
    ['saphir', 'perfumy', 'SAP-119', 'SAPHIR WOMEN Woda perfumowana SELECT', '200 ml', '83444-large_default/saphir-women-woda-perfumowana-select-200-ml.jpg'],
    ['saphir', 'perfumy', 'SAP-296', 'SAPHIR WOMEN Woda perfumowana FREEDOM', '200 ml', '83473-large_default/saphir-woman-freedom-woda-perfumowana-200-ml.jpg'],
    ['saphir', 'perfumy', 'SAP-266', 'SAPHIR WOMEN Woda perfumowana AGUA', '50 ml', '88944-large_default/saphir-women-woda-perfumowana-agua-50-ml.jpg'],
    ['saphir', 'perfumy', 'SAP-292', 'SAPHIR MEN Woda perfumowana THE FIGHTER', '200 ml', '99358-large_default/saphir-men-woda-perfumowana-the-fighter-200-ml.jpg', 'Linia Saphir Men w pojemności 200 ml.', { featured: true }],
    ['saphir', 'perfumy', 'SAP-025', 'SAPHIR MEN Woda perfumowana ACQUA UOMO', '200 ml', '83431-large_default/saphir-woda-perfumowana-men-acqua-uomo-200-ml.jpg'],
    ['saphir', 'perfumy', 'SAP-085', 'SAPHIR MEN Woda perfumowana BOXES DYNAMIC', '50 ml', '88912-large_default/saphir-men-edp-boxes-dynamic-50-ml.jpg'],
    ['flor-de-mayo', 'perfumy', 'FDM-070', 'FLOR DE MAYO PREMIUM Woda perfumowana UNICORN TEARS', '28 ml', '23065-large_default/flor-de-mayo-premium-woda-perfumowana-28ml-unicorn.jpg', undefined, { featured: true }],
    ['flor-de-mayo', 'perfumy', 'FDM-078', 'FLOR DE MAYO APPLE Woda perfumowana MS.GOLD, pakiet', '18 × 20 ml', '23068-large_default/flor-de-mayo-woman-woda-perfumowana-20-ml-apple-msgold-pakiet-a171.jpg', 'Pakiet ekspozycyjny 18 sztuk do drogerii.', { packQty: 18 }],
    ['flor-de-mayo', 'pielegnacja', 'FDM-038', 'FLOR DE MAYO HAND Żel do rąk z aloesem, 70% alkoholu', '70 ml', '13559-large_default/fdm-zel-d-m-rak-70ml-aloe-vera.jpg'],
    ['instituto-espanol', 'pielegnacja', 'K-180', 'INSTITUTO ESPANOL ALOE VERA Nawilżający krem do ciała i rąk', '400 ml', '69646-large_default/nawilzajacy-krem-do-ciala-i-rak.jpg', 'Seria Aloe Vera: nawilżenie na bazie aloesu, duża pojemność z pompką.', { featured: true }],
    ['instituto-espanol', 'pielegnacja', 'K-199', 'INSTITUTO ESPANOL ROSA MOSQUETA Nawilżający krem do ciała i rąk', '400 ml', '15371-large_default/instituto-espanol-rosa-krem-do-ciala-400ml.jpg'],
    ['instituto-espanol', 'pielegnacja', 'INS-008', 'INSTITUTO ESPANOL ROSA MOSQUETA Balsam do ciała, opakowanie rodzinne', '950 ml', '25764-large_default/instituto-espanol-rosa-mosqueta-nawilzajacy-balsam-do-ciala-950-ml.jpg', undefined, { featured: true }],
    ['instituto-espanol', 'pielegnacja', 'K-302', 'INSTITUTO ESPANOL Krem do ciała z arniką', '150 ml', '99127-large_default/instituto-espanol-arnika-krem-na-zmeczone-stopy-150ml.jpg', 'Kojący krem z arniką, który wspiera regenerację skóry i łagodzi napięcia.', { isNew: true }],
    ['instituto-espanol', 'pielegnacja', 'K-299', 'INSTITUTO ESPANOL ROSA MOSQUETA Nawilżający krem do ciała i rąk', '40 ml', '99126-large_default/instituto-espanol-rosa-mosqueta-krem-do-ciala-i-rak-50ml.jpg'],
    ['colorwin', 'wlosy', 'COL-010', 'COLORWIN RETOUCH Spray do retuszu odrostów SZATYN', '75 ml', '68351-large_default/colorwin-spray-do-retuszu-odrostow-szatyn-75-ml.jpg', 'Bez ciekłego silikonu. Natychmiastowy efekt, zmywa się szamponem.', { featured: true }],
    ['colorwin', 'wlosy', 'COL-011', 'COLORWIN RETOUCH Spray do retuszu odrostów JASNY BRĄZ', '75 ml', '68352-large_default/colorwin-spray-do-retuszu-odrostow-jasnobrazowy-75-ml.jpg'],
    ['colorwin', 'wlosy', 'COL-012', 'COLORWIN RETOUCH Spray do retuszu odrostów CIEMNY BRĄZ', '75 ml', '68353-large_default/colorwin-spray-do-retuszu-odrostow-ciemnobrazowy-75-ml.jpg'],
    ['colorwin', 'wlosy', 'COL-014', 'COLORWIN MEN Szampon redukujący siwiznę', '150 ml', '87466-large_default/colorwin-szampon-do-wlosow-redukujacy-siwizne-150-ml.jpg'],
    ['colorwin', 'wlosy', 'COL-015', 'COLORWIN MEN Szampon przeciw wypadaniu włosów', '150 ml', '87467-large_default/colorwin-szampon-do-wlosow-przeciw-wypadaniu-150-ml.jpg'],
    ['parafina-bronze', 'opalanie', 'PAR-003', 'PARAFINA BRONZE Rozświetlacz — krem do opalania 3w1 SPF15 z efektem glow', '120 ml', '99057-large_default/parafina-bronze-rozswietlacz-do-ciala-solar-shine-3w1-spf-15-120-ml.jpg', undefined, { isNew: true, featured: true }],
    ['parafina-bronze', 'opalanie', 'PAR-005', 'PARAFINA BRONZE Przyspieszacz — woda do twarzy i ciała', '200 ml', '99085-large_default/parafina-bronze-aqua-accelerator-woda-do-twarzy-i-ciala-przyspieszajaca-opalenizne-200-ml.jpg'],
    ['parafina-bronze', 'opalanie', 'PAR-001', 'PARAFINA BRONZE Bronzer — krem do opalania SPF8', '120 g', '99084-large_default/parafina-bronze-krem-do-opalania-przyspieszajacy-opalenizne-spf-8-120-g.jpg'],
    ['parafina-bronze', 'opalanie', 'PAR-006', 'PARAFINA BRONZE Samoopalacz — pianka do ciała na bazie wody', '150 ml', '99059-large_default/parafina-bronze-aqua-woda-do-ciala-samoopalajaca-150-ml.jpg'],
    ['parafina-bronze', 'opalanie', 'PAR-014', 'PARAFINA BRONZE Krople samoopalające do ciała Booster', '30 ml', '46774-large_default/parafina-bronze-krople-samoopalajace-do-ciala-30-ml.jpg'],
    ['gentle-day', 'higiena', 'GED-010', 'GENTLE DAY Tampony ze 100% bawełny ekologicznej Regular', '18 szt', '877-large_default/gentle-day-tampony-ekologiczne-regular-18-szt.jpg', 'Bez chloru, substancji zapachowych i chemikaliów.', { featured: true }],
    ['gentle-day', 'higiena', 'GED-001', 'GENTLE DAY ECO Podpaski z paskiem anionowym NA DZIEŃ', '10 szt', '31120-large_default/gentle-day-podpaski-ekologiczne-dzien-paskiem-anionowym-10-szt.jpg'],
    ['gentle-day', 'higiena', 'GED-003', 'GENTLE DAY ECO Podpaski z paskiem anionowym NA NOC', '8 szt', '31121-large_default/gentle-day-podpaski-ekologiczne-noc-paskiem-anionowym-8-szt.jpg'],
    ['gentle-day', 'higiena', 'GED-008', 'GENTLE DAY Płyn do higieny intymnej z pompką', '250 ml', '29206-large_default/gentle-day-naturalny-plyn-higieny-intymnej-250-ml.jpg', 'Kwas mlekowy, żel aloesowy i ekstrakt z żurawiny. Bez SLES, parabenów i barwników.'],
    ['asevi', 'chemia', 'ASE-001', 'ASEVI Zapachowy koncentrat do płukania tkanin DREAMS, 60 płukań', '1440 ml', '98106-large_default/asevi-koncentrat-do-plukania-60-plukan-dreams-1440-ml.jpg', 'Klasyczny zapach świeżego prania, skoncentrowana formuła na 60 płukań.', { isNew: true, featured: true }],
    ['asevi', 'chemia', 'ASE-002', 'ASEVI Zapachowy koncentrat do płukania tkanin PASSION, 60 płukań', '1440 ml', '98109-large_default/asevi-koncentrat-do-plukania-60-plukan-passion-1440-ml.jpg'],
    ['asevi', 'chemia', 'ASE-003', 'ASEVI Zapachowy koncentrat do płukania tkanin ZEN, 60 płukań', '1440 ml', '98892-large_default/asevi-koncentrat-do-plukania-60-plukan-zen-1440-ml.jpg'],
    ['asevi', 'chemia', 'ASE-011', 'ASEVI Koncentrat do płukania DREAMS, pakiet zbiorczy', '10 × 1440 ml', '98128-large_default/asevi-koncentrat-do-plukania-60-plukan-dreams-1440-ml-pakiet-10-x-1440-ml.jpg', 'Karton 10 sztuk dla sklepów.', { packQty: 10 }],
    ['asevi', 'chemia', 'ASE-005', 'ASEVI Koncentrat do mycia podłóg bezpieczny dla zwierząt PET', '1 l', '98494-large_default/asevi-koncentrat-do-podlog-pet-1-l.jpg'],
    ['asevi', 'chemia', 'ASE-006', 'ASEVI Koncentrat do mycia podłóg MIO', '1 l', '98114-large_default/asevi-koncentrat-do-podlog-mio-1-l.jpg'],
    ['asevi', 'chemia', 'ASE-008', 'ASEVI Spray czyszczący do łazienki KAMIEŃ i OSAD', '720 ml', '98495-large_default/asevi-spray-do-lazienki-kamien-i-plesn-720-ml.jpg'],
    ['asevi', 'chemia', 'ASE-060', 'ASEVI Żel do prania kolorowych ubrań ACTIV, 44 prania', '2,376 l', '99070-large_default/asevi-zel-do-prania-colors-kolor-44-pran-2376-l.jpg', undefined, { isNew: true }],
    ['asevi', 'chemia', 'ASE-023', 'ASEVI Odplamiacz do tkanin UNIWERSALNY', '750 ml', '98671-large_default/asevi-odplamiacz-do-tkanin-uniwersalny-750-ml.jpg'],
    ['maxi-power', 'chemia', 'MAX-001', 'MAXI POWER Płyn do naczyń BANANOWY, pompka i gąbka', '1 l', '98116-large_default/maxi-power-plyn-do-naczyn-bananowy-pompkagabka-1-l.jpg', undefined, { featured: true }],
    ['maxi-power', 'chemia', 'MAX-002', 'MAXI POWER Płyn do naczyń CYTRYNOWY, pompka i gąbka', '1 l', '98118-large_default/maxi-power-plyn-do-naczyn-cytrynowy-pompkagabka-1-l.jpg'],
    ['maxi-power', 'chemia', 'MAX-004', 'MAXI POWER Płyn do naczyń PLATINUM, pompka i gąbka', '1 l', '94342-large_default/maxi-power-plyn-do-naczyn-platinum-pompkagabka-1-l.jpg'],
    ['la-casa-de-los-aromas', 'zapachy-do-domu', 'LCA-066', 'LA CASA DE LOS AROMAS OH! HAPPY Patyczki zapachowe ALMOND BLOSSOM', '100 ml', '14371-large_default/la-casa-de-los-aromas-patyczki-zapachowe-oh-almond-blossom-100ml.jpg', undefined, { featured: true }],
    ['la-casa-de-los-aromas', 'zapachy-do-domu', 'LCA-068', 'LA CASA DE LOS AROMAS OH! HAPPY Patyczki zapachowe TROPICAL SUMMER', '100 ml', '14373-large_default/la-casa-de-los-aromas-patyczki-zapachowe-oh-tropical-summer-100ml.jpg'],
    ['la-casa-de-los-aromas', 'zapachy-do-domu', 'LCA-040', 'LA CASA DE LOS AROMAS BOTANIC Patyczki zapachowe CYNAMON–POMARAŃCZA', '50 ml', '93714-large_default/lca-olejek-aromatyczny-z-patyczkami-cynamon-pomarancza-50ml.jpg'],
    ['la-casa-de-los-aromas', 'zapachy-do-domu', 'LCA-052', 'LA CASA DE LOS AROMAS BOTANIC Patyczki zapachowe KWIAT BAWEŁNY', '50 ml', '93716-large_default/lca-olejek-aromatyczny-z-patyczkami-bawelna-50ml.jpg'],
  ]
  for (const [brand, cat, sku, name, size, img, short, flags] of products) {
    const slug = sku.toLowerCase() + '-' + name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)
    await payload.create({ collection: 'products', data: { brand: brands[brand], category: cats[cat], sku, slug, name, size, short, imageUrl: D + img, ...flags } })
  }
  console.log('[seed] produkty:', products.length)

  await payload.updateGlobal({ slug: 'settings', data: {
    banner: 'Zamówienia B2B: pon.–pt. w godzinach pracy biura. Wysyłka z magazynu w Czachorowie.',
    heroTitle: 'Hiszpańskie marki kosmetyczne i chemia gospodarcza dla Twojej drogerii',
    heroText: 'Importujemy i dystrybuujemy Instituto Español, Saphir, Asevi, Flor de Mayo i La Casa de los Aromas. Do tego producenci krajowi. Jedno zamówienie, jedna faktura, 5291 pozycji w katalogu.',
    heroImageUrl: D + 'img/cms/nowa/Conjunto_Wild_Safari_2.jpg',
    about: 'P.H. DAVI Sp. z o.o. z Czachorowa koło Gostynia to hurtownia kosmetyków i chemii gospodarczej oraz wyłączny importer hiszpańskich marek na polski rynek. Sprzedajemy firmom: drogeriom, sklepom internetowym, hurtowniom i salonom.',
    terms: [
      { title: 'Wniosek i weryfikacja NIP', body: 'Wypełniasz krótki formularz. Sprawdzamy dane firmy i zakładamy konto, zwykle w jeden dzień roboczy.' },
      { title: 'Cennik hurtowy po zalogowaniu', body: 'Widzisz ceny netto, rabaty ilościowe i dostępność magazynową. Bez konta katalog pokazuje asortyment i indeksy.' },
      { title: 'Zamówienie z listy', body: 'Dodajesz pozycje w katalogu, poprawiasz ilości na jednej liście i wysyłasz. Opakowania zbiorcze liczymy automatycznie.' },
      { title: 'Płatność i dostawa', body: 'Płatność online albo na termin dla stałych klientów. Wysyłka kurierem lub paletą z magazynu w Czachorowie.' },
    ],
    phone: '661 947 223', email: 'b2b@davi.com.pl', address: 'P.H. DAVI Sp. z o.o.\nCzachorowo 46\n63-800 Gostyń', nip: '6960007530', hours: 'Poniedziałek – piątek, 8:00–16:00',
    departments: ['B2B – Obsługa Klientów', 'Obsługa klientów hurtowych', 'Dział księgowości', 'Dział rozliczeń', 'Dział transportu', 'Magazyn', 'Sekretariat DAVI'].map((name) => ({ name })),
  } })
  console.log('[seed] gotowe')
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
