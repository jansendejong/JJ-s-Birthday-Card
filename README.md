JJ's Birthday Card

Een eenvoudige en visuele Lovelace-kaart voor Home Assistant die aankomende verjaardagen toont. De kaart is ontworpen om snel overzicht te geven van wie er jarig is, inclusief sortering en visuele markering van verjaardagen die vandaag plaatsvinden.


*********************************************************************************************************

🎉 Functionaliteiten

✅ Toon verjaardagen binnen een instelbaar aantal dagen vooruit
✅ Sortering op naam of datum
✅ Verjaardagen van vandaag staan altijd bovenaan en krijgen een opvallende stijl
✅ Volledig configureerbaar via de Lovelace UI-editor (visual editor)
✅ Compatibel met HACS (bij handmatige installatie als custom repository)


*********************************************************************************************************

📁 Bestandenstructuur

www/jjs-birthday-card/
├── jjs-birthday-card.js             # De Lovelace kaart
├── card-editor.js                   # Visuele editor in de UI
├── hacs.json                        # HACS metadata
├── README.md                        # Deze handleiding
└── LICENSE                          # MIT-licentie


*********************************************************************************************************

⚙️ Installatie (Handmatig)

1. Maak de map aan:
    /config/www/jjs-birthday-card/

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


*********************************************************************************************************

💻 Gebruik in Lovelace

Via YAML:

type: custom:js-simple-birthday-card
birthdays:
  - name: Jan
    date: "1985-10-20"
  - name: Lisa
    date: "1992-12-05"
days_ahead: 7
sort_by: date  # of 'name'


-------------------------------------------------------------------------------------------------------

Via UI (Visual Editor):

1. Ga naar je dashboard

2. Klik [Dashboard Bewerken] → [Kaart toevoegen] → Custom: JJ's Birthday Card

3. Voeg verjaardagen toe, kies sortering en het aantal dagen vooruit


*********************************************************************************************************

⚙️ Configuratie-opties

Optie	      Type	    Beschrijving	                            Voorbeeld

birthday	  list	    Lijst met personen + hun geboortedatum	  [{name, date}]
name	      string	  Naam van de jarige	                      "Lisa"
date	      string	  Geboortedatum                             (DD-MM-YYYY)	"06-12-1989"
days_ahead	number	  Aantal dagen vooruit zichtbaar	          7
sort_by	    string	  Sorteer op name of date	                  "name"


*********************************************************************************************************

🎨 Functionaliteit: Verjaardagen van Vandaag

Verjaardagen die vandaag zijn krijgen een opvallende gele achtergrond en staan altijd bovenaan.

Datum wordt automatisch geconverteerd naar het huidige jaar.


*********************************************************************************************************

🚀 Installatie via HACS (Custom Repository)

1. Open HACS → Repositories


2. Klik rechtsboven op +


3. Voeg de GitHub link toe (bijv. https://github.com/jouw-gebruikersnaam/js-simple-birthday-card)


4. Kies categorie Lovelace


5. Installeer → Herlaad frontend


*********************************************************************************************************

✅ Toekomstige functies (optioneel)

🎁 Automatische herinneringen via notificatie

🌐 Vertalingen (ENG/NL/DE)


*********************************************************************************************************

<img width="401" height="184" alt="JJ's Birthday Card" src="https://github.com/user-attachments/assets/e4801d7f-9f8b-4a25-967e-aec806d28827" />

<img width="934" height="609" alt="JJ's Birthday Card Config Sort" src="https://github.com/user-attachments/assets/2e4563a8-b704-41a4-975d-c3f4a38a9cff" />

<img width="933" height="614" alt="JJ's Birthday Card Config Color" src="https://github.com/user-attachments/assets/f5401856-253c-42dc-94eb-7acbcfd8fa68" />

<img width="932" height="608" alt="JJ's Birthday Card Config Date" src="https://github.com/user-attachments/assets/255bce36-6abe-430e-9061-5ef91a14faf5" />

*********************************************************************************************************

📄 Licentie

Dit project maakt gebruik van de MIT-licentie. Je mag het vrij gebruiken, aanpassen en verspreiden.


*********************************************************************************************************

❤️ Credits & Contact

Gemaakt door: J. de Jong
Feedback of ideeën? Open een issue of pull request via GitHub.

Veel plezier met je kaart! 🎂
