# Elering connection

## Backend
### using libraries:
1. Express - http server
2. Cors - Security for http server
3. Mongodb - Connector to MongoDB database
4. Axios - Http request tool

Backend is using 3000/tcp port as http by default.

## Frontend
### Using libraries
1. React - Framework for ui
2. Vite - Creation tool
3. Axios - Http request tool

Frontend is using 8085/tcp port as https by default.

# How to run
`If you cloned it without node_modules, run install.bat file to install every dependency`
1. Run `migrate_backend.bat` to run database collection creating
2. Download or open existing main folder
3. Run `run_backend.bat` to run backend
4. Run `run_frontend.bat` to run frontend
5. Visit http://127.0.0.1:8085/ website