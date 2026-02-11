# Noormeister 2026 Module A by Klarulor

## Instructions
1. Every console out may be not the same as here in readme file because here is full guide how to run. There is professional execution context. 

## Tools
1. MongoDB - Database with dynamic schema that runs at 27017 port
2. NodeJS - V8 Javascript Engine Runtime
3. Typescript Language 

## Backend
### Using libraries:
1. Express - http server
2. Cors - Security for http server
3. Mongodb - Connector to MongoDB database
4. Axios - Http request tool
5. @types/node - Typescript node support
7. Moment.Js - For validation time and dates

Backend is using 3000/tcp port as http by default.

## Frontend
### Using libraries
1. React - Framework for ui
2. Vite - Creation tool
3. Axios - Http request tool

Frontend is using 8085/tcp port as https by default.

# How to run
If you cloned it without node_modules, run `install.ps1` file to install every dependency. P.S. Right click on file, select `Run with Powershell`.
| Or go to backend folder, open terminal and write `npm i`, same with frontend folder.
1. Download or open existing main folder
2. Run `migrate_backend.bat` to run database collection creating.
| Or run by yourself command in backend folder `npm run migrate`.
3. Run `run_backend.bat` to run backend
| Or manually open backend folder, there terminal and run `npm run start`.
4. Run `run_frontend.bat` to run frontend
| Or manually open frontend folder, there terminal and run `npx vite --port 8085`
5. Visit http://127.0.0.1:8085/ website



# Contacts
## Noormeister 2026
Ida-Virumaa Kutsehariduskeskus Tarvaraarendaja 4 kursus
Vladislav Šišelov.
vladislav.shishelov@gmail.com