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

```text
www/jjs-birthday-card/   
├── jjs-birthday-card.js          
├── hacs.json                         
├── README.md                       
└── LICENSE
```                      

*********************************************************************************************************  
  
⚙️ **Manual Installation**  
  
1. Create the folder:
```text
     /config/www/jjs-birthday-card/
```
3. Place the following file inside this folder:  
     jjs-birthday-card.js  
4. Add this resource to Home Assistant:  
   Via UI:  
   Settings → Dashboards → Resources → + Add
```text 
     URL: /local/jjs-birthday-card/jjs-birthday-card.js  
      Type: JavaScript Module
```
6. Reload the browser or press CTRL+F5  
   
*********************************************************************************************************  
  
🚀 **Installation via HACS**  
1. Open HACS 
3. Search for 'JJs Birthday Card
3. Install 
4. Reload the frontend  

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
```

-------------------------------------------------------------------------------------------------------

***Via UI (Visual Editor):***  
1. Open your dashboard
2. Click Edit Dashboard → Add Card → Custom: JJ's Birthday Card
3. Add birthdays, choose sorting and set the number of days ahead

*********************************************************************************************************

⚙️ **Configuration Options**  

```text
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
```

*********************************************************************************************************

🖼️ **Screenshots**  

![jjs-birthday-card multilanguage](https://github.com/user-attachments/assets/fce82d13-a16b-401c-bee4-add6ca19b765)

![jjs-birthday-card-editor multilanguage](https://github.com/user-attachments/assets/ad3f261d-a61b-4970-a299-baf8c6cd22de)

*********************************************************************************************************

📄 **License**  

This project is licensed under the MIT License.
You are free to use, modify, and distribute it.

*********************************************************************************************************

❤️ **Credits & Contact**  

Created by: J. de Jong (J.J.)
Feedback or ideas? Feel free to open an issue or pull request on GitHub.

Enjoy the card! 🎂

<a href="https://www.buymeacoffee.com/jdejong" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
