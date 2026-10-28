# Vaatimusmäärittely – Elokuvaharrastajien yhteisöpalvelu

Versio 1.0 · 28.10.2026

## 1. Johdanto

Palvelu on verkkopalvelu, jossa kaveriporukat ja elokuvakerhot löytävät elokuvia, arvostelevat niitä ja jakavat suosituksia omassa ryhmässään. Tavoitteena on muutama tuhat aktiivista käyttäjää.

**Ongelma:** Suositukset jaetaan WhatsAppissa ja unohtuvat ennen kuin elokuvaa ehditään katsoa. Excel-taulukoita ei jakseta päivittää. IMDb ja Letterboxd näyttävät tuntemattomien arviot, eivät oman porukan.

**Erottava tekijä:** Kavereiden ja oman yhteisön arviot painavat enemmän kuin satunnaisten käyttäjien.

**Termit:** FR = toiminnallinen vaatimus (mitä järjestelmä tekee). NFR = ei-toiminnallinen vaatimus (laatu, käytettävyys, turvallisuus, suorituskyky).

**Priorisointi (MoSCoW):** Must = ensimmäinen versio · Should = tärkeä, mahdollisimman pian · Could = jatkokehitys.

## 2. Käyttäjäroolit

| Rooli | Mitä voi tehdä |
| --- | --- |
| Vierailija | Selata ja hakea elokuvia, lukea julkisia arvosteluja ja jaettuja listoja, nähdä ryhmien perustiedot |
| Rekisteröitynyt käyttäjä | Lisäksi arvostella, tehdä listoja, perustaa ryhmiä ja hakea niihin, keskustella ryhmissä |
| Ryhmän admin | Lisäksi hyväksyä/hylätä jäsenhakemukset, poistaa jäseniä, hallita ja poistaa ryhmän |
| Palvelun ylläpitäjä | Puuttua asiattomaan sisältöön ja käyttäjiin |

## 3. Toiminnalliset vaatimukset (FR)

### Elokuvien selaus ja haku

| ID | Vaatimus | Prioriteetti |
| --- | --- | --- |
| FR-01 | Etusivulla voi selata elokuvia heti, ilman kirjautumista. | Must |
| FR-02 | Etusivulla näytetään ajankohtaisia ja kiinnostavia elokuvia. | Must |
| FR-03 | Elokuvia voi hakea nimellä. | Must |
| FR-04 | Elokuvasivulla näkyy juliste, nimi, vuosi, kuvaus, genre, ohjaaja ja näyttelijät (jos saatavilla). | Must |
| FR-05 | Elokuvatiedot haetaan ulkoisesta tietokannasta (TMDB). | Must |
| FR-06 | Hakua voi rajata näyttelijän, vuoden ja genren perusteella, ja tuloksia voi lajitella. | Should |
| FR-07 | Elokuvasivulla näytetään samankaltaisia elokuvia. | Should |
| FR-08 | Elokuvasivulla näytetään, missä päin Suomea elokuva on teattereissa. | Could |

### Käyttäjätili

| ID | Vaatimus | Prioriteetti |
| --- | --- | --- |
| FR-09 | Käyttäjä voi rekisteröityä ja kirjautua. | Must |
| FR-10 | Muille näkyy käyttäjän valitsema näyttönimi, ei sähköpostiosoitetta. | Must |
| FR-11 | Käyttäjä voi hallita omia listojaan, arvostelujaan ja ryhmäjäsenyyksiään profiilissaan. | Should |
| FR-12 | Käyttäjillä on julkinen käyttäjäsivu, jonka näkyvyyttä voi säätää. | Could |
| FR-13 | Kirjautumisessa voi käyttää kaksivaiheista tunnistautumista. | Could |

### Arvostelut

| ID | Vaatimus | Prioriteetti |
| --- | --- | --- |
| FR-14 | Kirjautunut käyttäjä voi antaa elokuvalle 1–5 tähteä. | Must |
| FR-15 | Käyttäjä voi kirjoittaa kommentin tai arvostelun; siinä näkyy näyttönimi ja päiväys. | Must |
| FR-16 | Julkisia arvosteluja voi lukea ilman kirjautumista. | Must |
| FR-17 | Kirjoittaja valitsee, näkyykö arvostelu julkisesti vai vain valitulle ryhmälle. | Should |

### Elokuvalistat

| ID | Vaatimus | Prioriteetti |
| --- | --- | --- |
| FR-18 | Käyttäjä voi tallentaa elokuvia katselutoivelistalle ja poistaa niitä. | Must |
| FR-19 | Käyttäjä voi tehdä suosikkilistan ja omia nimettyjä listoja (esim. "10 parasta scifiä"). | Should |
| FR-20 | Listan voi jakaa linkillä, ja sen voi avata ilman käyttäjätiliä. | Should |

### Ryhmät

| ID | Vaatimus | Prioriteetti |
| --- | --- | --- |
| FR-21 | Käyttäjä voi perustaa ryhmän helposti (nimi, kuvaus). Perustajasta tulee admin. | Must |
| FR-22 | Ryhmällä on oma sivu: tiedot, jäsenmäärä, elokuvat ja arvostelut. | Must |
| FR-23 | Ryhmään liitytään kutsulla tai liittymispyynnöllä, jonka admin hyväksyy tai hylkää. | Must |
| FR-24 | Ryhmän jäsenet voivat keskustella ryhmän chatissa. | Must |
| FR-25 | Jäsen voi poistua ryhmästä. | Should |
| FR-26 | Admin voi poistaa jäseniä, muokata ryhmän tietoja ja poistaa ryhmän. | Should |
| FR-27 | Jäsenet voivat lisätä elokuvia ryhmän yhteiseen listaan. | Should |
| FR-28 | Jäsen näkee, kuka ryhmässä on suositellut tai arvostellut elokuvan. | Should |
| FR-29 | Käyttäjä voi kutsua kavereitaan palveluun ja ryhmään. | Should |
| FR-30 | Ryhmiä voi selata ja löytää palvelusta. | Should |
| FR-31 | Jäsenlista näkyy vain ryhmän jäsenille. | Could |

### Suositukset

| ID | Vaatimus | Prioriteetti |
| --- | --- | --- |
| FR-32 | Palvelu suosittelee elokuvia käyttäjän arvioiden ja listojen perusteella. | Could |
| FR-33 | Palvelu näyttää tilastoja käyttäjien ja ryhmien suosimista genreistä. | Could |

## 4. Ei-toiminnalliset vaatimukset (NFR)

| ID | Luokka | Vaatimus | Prioriteetti |
| --- | --- | --- | --- |
| NFR-01 | Käytettävyys | Palvelu toimii puhelimella, tabletilla ja tietokoneella; painikkeet sopivat kosketusnäytölle. | Must |
| NFR-02 | Käytettävyys | Ulkoasu on asiallinen ja selkeä, julisteet keskeisessä roolissa (mallina esim. Finnkino). | Must |
| NFR-03 | Käytettävyys | Rekisteröityminen ja ryhmän perustaminen onnistuvat muutamalla askeleella. | Must |
| NFR-04 | Saavutettavuus | Riittävä kontrasti, selkeä navigointi ja näppäimistökäyttö. | Should |
| NFR-05 | Tietoturva | Salasanat tallennetaan hajautettuina (hash), ja yhteys on suojattu (HTTPS). | Must |
| NFR-06 | Tietoturva | Käyttöoikeudet tarkistetaan palvelimella; ryhmän chat ja ryhmäarvostelut eivät näy ulkopuolisille edes suoralla linkillä. | Must |
| NFR-07 | Tietoturva | Salasanalle on vähimmäisvaatimukset, eikä liian helppoja hyväksytä. | Should |
| NFR-08 | Tietosuoja | Henkilötietoja käsitellään GDPR:n mukaisesti. | Must |
| NFR-09 | Suorituskyky | Haku ja selaus toimivat ilman turhia viiveitä tavallisella mobiiliyhteydellä; kuvat ladataan tarpeen mukaan. | Should |
| NFR-10 | Skaalautuvuus | Palvelu kestää muutaman tuhannen käyttäjän kuorman. | Should |
| NFR-11 | Ylläpidettävyys | Elokuvatietolähteen voi vaihtaa ilman koko järjestelmän uudelleenrakentamista. | Should |
| NFR-12 | Lisensointi | TMDB:n käyttöehtoja noudatetaan, ja lähde mainitaan sivulla. | Must |
| NFR-13 | Kieli | Käyttöliittymä on suomeksi; rakenne sallii ruotsin ja englannin lisäämisen. | Must |
| NFR-14 | Kieli | Ruotsin- ja englanninkielinen käyttöliittymä. | Could |

## 5. Rajaukset

Palvelu **ei** tarjoa elokuvien suoratoistoa, latausta, ostoa tai vuokrausta. Se ei ole avoin arvostelualusta tuntemattomille, vaan painopiste on omissa porukoissa.

## 6. Jatkokehitys ja liiketoiminta

- Kasvu suusanallisesti: käyttäjät perustavat ryhmiä ja kutsuvat kavereitaan.
- Maksulliset ominaisuudet elokuvakerhoille.
- Yhteistyö elokuvateattereiden ja -tapahtumien kanssa, esitysajat palveluun.
- Kehittyneempi (esim. tekoälypohjainen) suosittelu.

## 7. Avoimet kysymykset

- Onko ryhmächat reaaliaikainen vai keskusteluketju?
- Mitä maksullinen kerhoversio sisältää ja mitä se maksaa?
- Mistä teattereiden esitysajat haetaan?
