J's Simple Birthday Card

Een eenvoudige en visuele Lovelace-kaart voor Home Assistant die aankomende verjaardagen toont. De kaart is ontworpen om snel overzicht te geven van wie er jarig is, inclusief sortering en visuele markering van verjaardagen die vandaag plaatsvinden.


---

🎉 Functionaliteiten

✅ Toon verjaardagen binnen een instelbaar aantal dagen vooruit
✅ Sortering op naam of datum
✅ Verjaardagen van vandaag staan altijd bovenaan en krijgen een opvallende stijl
✅ Volledig configureerbaar via de Lovelace UI-editor (visual editor)
✅ Compatibel met HACS (bij handmatige installatie als custom repository)


---

📁 Bestandenstructuur

www/js-simple-birthday-card/
├── js-simple-birthday-card.js       # De Lovelace kaart
├── card-editor.js                   # Visuele editor in de UI
├── hacs.json                        # HACS metadata (indien gebruikt)
├── README.md                        # Deze handleiding
└── LICENSE                          # MIT-licentie (optioneel)


---

⚙️ Installatie (Handmatig)

1. Maak de map aan:
/config/www/js-simple-birthday-card/


2. Plaats de volgende bestanden in deze map:

js-simple-birthday-card.js

card-editor.js



3. Voeg deze resources toe in Home Assistant:

Via UI:
Instellingen → Dashboards → Bronnen → + Toevoegen

URL: /local/js-simple-birthday-card/js-simple-birthday-card.js

Type: JavaScript Module

URL: /local/js-simple-birthday-card/card-editor.js

Type: JavaScript Module



4. Herlaad de browser of druk CTRL+F5




---

💻 Gebruik in Lovelace

Via YAML:

type: custom:js-simple-birthday-card
birthdays:
  - name: Jan
    date: "1985-10-20"
  - name: Lisa
    date: "1992-12-05"
days_ahead: 10
sort_by: date  # of 'name'

Via UI (Visual Editor):

1. Ga naar je dashboard


2. Klik Bewerken → + Kaart toevoegen → Custom: J's Simple Birthday Card


3. Voeg verjaardagen toe, kies sortering en het aantal dagen vooruit




---

⚙️ Configuratie-opties

Optie	Type	Beschrijving	Voorbeeld

birthdays	list	Lijst met personen + hun geboortedatum	[{name, date}]
name	string	Naam van de jarige	"Lisa"
date	string	Geboortedatum (YYYY-MM-DD)	"1990-12-05"
days_ahead	number	Aantal dagen vooruit zichtbaar	7
sort_by	string	Sorteer op name of date	"name"



---

🎨 Functionaliteit: Verjaardagen van Vandaag

Verjaardagen die vandaag zijn krijgen een opvallende gele achtergrond en staan altijd bovenaan.

Datum wordt automatisch geconverteerd naar het huidige jaar.



---

🚀 Installatie via HACS (Custom Repository)

1. Open HACS → Repositories


2. Klik rechtsboven op +


3. Voeg de GitHub link toe (bijv. https://github.com/jouw-gebruikersnaam/js-simple-birthday-card)


4. Kies categorie Lovelace


5. Installeer → Herlaad frontend




---

✅ Toekomstige functies (optioneel)

🎁 Automatische herinneringen via notificatie

🗓️ Koppeling met person of calendar entities

🌐 Vertalingen (ENG/NL/DE)

📅 ICS/Google Calendar integratie



---

📄 Licentie

Dit project maakt gebruik van de MIT-licentie. Je mag het vrij gebruiken, aanpassen en verspreiden.


---

❤️ Credits & Contact

Gemaakt door: J
Feedback of ideeën? Open een issue of pull request via GitHub.

Veel plezier met je kaart! 🎂