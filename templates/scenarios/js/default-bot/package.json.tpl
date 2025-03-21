{
    "name": "{%appName%}",
    "version": "1.0.0",
    "msteams": {
      "teamsAppId": null
    },
    "description": "Microsoft Teams Toolkit hello world Bot sample",
    "engines": {
        "node": "14 || 16 || 18"
    },
    "author": "Microsoft",
    "license": "MIT",
    "main": "index.js",
    "scripts": {
        "dev:teamsfx": "env-cmd --silent -f .localSettings npm run dev",
        "dev": "nodemon --inspect=9239 --signal SIGINT ./index.js",
        "start": "node ./index.js",
        "watch": "nodemon ./index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "dependencies": {
        "@microsoft/adaptivecards-tools": "^1.0.0",
        "botbuilder": "^4.18.0",
        "restify": "^10.0.0"
    },
    "devDependencies": {
        "env-cmd": "^10.1.0",
        "nodemon": "^2.0.7"
    }
}
