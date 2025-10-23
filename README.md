**JJ's Birthday Card**

A simple and user-friendly Lovelace card for Home Assistant that displays upcoming birthdays. The card is designed to give you a quick overview of who has a birthday soon.
The visual editor makes it easy to customize the card to your liking.

*********************************************************************************************************

🎉 **Features**

✅ Both the card and the editor support English, Dutch, German, French and Spanish (automatically adjusts to the user’s language – default is English)
✅ Use the default header, create your own custom header, or hide the header entirely
✅ Display birthdays within a configurable number of upcoming days
✅ Sort by name or date
✅ Choose your own highlight color for people who have their birthday today
✅ Fully configurable via the Lovelace UI editor (visual editor)
✅ Compatible with HACS (when added manually as a custom repository)

*********************************************************************************************************

📁 **Bestandenstructuur**

www/jjs-birthday-card/
├── jjs-birthday-card.js        
├── hacs.json                       
├── README.md                      
└── LICENSE                          

*********************************************************************************************************

⚙️ **Manual Installation**

1. Create the folder:
     '/config/www/jjs-birthday-card/'
3. Place the following file inside this folder:
jjs-birthday-card.js
4. Add this resource to Home Assistant:
   Via UI:
   Settings → Dashboards → Resources → + Add
     'URL: /local/jjs-birthday-card/jjs-birthday-card.js'
     'Type: JavaScript Module'
5. Reload the browser or press CTRL+F5

*********************************************************************************************************

🚀 **Installation via HACS (Custom Repository)**
1. Open HACS → Repositories
2. Click the + button in the top-right
3. Add the GitHub link:
   https://github.com/jansendejong/jjs-birthday-card
4. Install → Reload the frontend

*********************************************************************************************************

💻 **Gebruik in Lovelace**
***Via YAML:***

```yaml
type: custom:jjs-birthday-card
birthdays:
  - name: Jan
    date: "1985-10-20"
  - name: Lisa
    date: "1992-12-05"
days_ahead: 7
sort_by: date  # or 'name'

-------------------------------------------------------------------------------------------------------

***Via UI (Visual Editor):***
1. Open your dashboard
2. Click Edit Dashboard → Add Card → Custom: JJ's Birthday Card
3. Add birthdays, choose sorting and set the number of days ahead

*********************************************************************************************************

⚙️ **Configuration Options**

| Option        | Type   | Description                           | Example               |
| ------------- | ------ | ------------------------------------- | --------------------- |
| show_header   | toggle | Show or hide the header               | on / off              |
| custom_header | string | Use your own custom header            | "Birthdays this week" |
| sort_by       | string | Sort by `name` or `date`              | "name"                |
| days_ahead    | number | Number of upcoming days to display    | 7                     |
| today_color   | color  | Background color for today's birthday | "#ab8b3a"             |
| birthdays     | list   | List of people and their birthdates   | [{name, date}]        |
| name          | string | Name of the person                    | "Lisa"                |
| date          | string | Date of birth (YYYY-MM-DD)            | "1989-12-06"          |

*********************************************************************************************************

🖼️ **Screenshots**

![jjs-birthday-card multilanguage](https://github.com/user-attachments/assets/c40ce6f8-c4eb-42b1-8108-3d4df190ab4c)
![jjs-birthday-card-editor multilanguage](https://github.com/user-attachments/assets/d8bdd308-0273-44c4-bd6b-e4b75b1e95fd)



*********************************************************************************************************

📄 **License**

This project is licensed under the MIT License.
You are free to use, modify, and distribute it.

*********************************************************************************************************

❤️ **Credits & Contact**

Created by: J. de Jong (J.J.)
Feedback or ideas? Feel free to open an issue or pull request on GitHub.

Enjoy the card! 🎂
