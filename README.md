# Intelliboard Starter Frontend

This is a blueprint for Intelliboard Frontend made by Intelliway. It was designed to be cloned to every new project that uses a chatbot and serve as a base to them.
Important: this project is supposed to be forked!

## Code Guidelines
 - Code is written in English
 - Use arrow functions only when creating one-line functions or anonymous functions.
 - Use function syntax when creating functions to be exported on files.
 - Use Object.freeze when exporting multiple functions or objects.
 - Try not to deconstruct objects directly on function parameters
 - Format code with CTRL + SHIFT + F (or equivalent)
 - Don't use var (only let and const)
 - Promises should be handled with async/await
 - Name variables and functions with camelCase, constants with UPPER_CASE

 ## Initial configurations
 - After forking and cloning, you should create a file called env.js on src folder. On the same folder there is a env-example.js file that you can use as a template.

## Important information
### Files and Folder meanings
 - Every variable that may change depending if it's running on production or dev, should be on **env.js**. Every other constant variable should be on **constants.js**.
 - To deploy on production, run **npm run build** to generate the **build** folder. Then, run **pm2 start server.js --name intelliboard-frontend**. The default port is 3000, change it on the **server.js** file if needed.

### Folder structure
**server.js** File to serve the app on production
**src/** Here is all code of project
**src/assets/** Here we should put all assets (images, most of the time)
**src/components/** Here we should put all components that can be reused on several locations, like a Button or Avatar component
**src/pages/** Here we should put all components that represent a new page on the application, like Intellilogs or Intellichat
**src/services/** Here we should put all functions that connect to external apis or services
**src/store/** Here we should put all Redux actions e reducers
**src/utils/** Here are all functions shared by other functions, basically some utility functions