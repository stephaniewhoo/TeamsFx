# Visit https://aka.ms/teamsfx-v5.0-guide for details on this file
# Visit https://aka.ms/teamsfx-actions for details on actions
version: 1.0.0

provision:
  - uses: teamsApp/create # Creates a Teams app
    with:
      name: {%appName%}-${{TEAMSFX_ENV}} # Teams app name
    # Output: following environment variable will be persisted in current environment's .env file.
    # TEAMS_APP_ID: the id of Teams app

  - uses: botAadApp/create # Creates a new AAD app for bot if BOT_ID environment variable is empty
    with:
      name: {%appName%}
    # Output: following environment variable will be persisted in current environment's .env file.
    # BOT_ID: the AAD app client id created for bot
    # SECRET_BOT_PASSWORD: the AAD app client secret created for bot

  - uses: botFramework/create # Create or update the bot registration on dev.botframework.com
    with:
      botId: ${{BOT_ID}}
      name: {%appName%}
      messagingEndpoint: ${{BOT_ENDPOINT}}/api/messages
      description: ""
      channels:
        - name: msteams
        - name: m365extensions

  - uses: teamsApp/validateManifest # Validate using manifest schema
    with:
      manifestPath: ./appPackage/manifest.json # Path to manifest template

  - uses: teamsApp/zipAppPackage # Build Teams app package with latest env value
    with:
      manifestPath: ./appPackage/manifest.json # Path to manifest template
      outputZipPath: ./build/appPackage/appPackage.${{TEAMSFX_ENV}}.zip
      outputJsonPath: ./build/appPackage/manifest.${{TEAMSFX_ENV}}.json

  - uses: teamsApp/update # Apply the Teams app manifest to an existing Teams app in Teams Developer Portal. Will use the app id in manifest file to determine which Teams app to update.
    with:
      appPackagePath: ./build/appPackage/appPackage.${{TEAMSFX_ENV}}.zip # Relative path to this file. This is the path for built zip file.
    # Output: following environment variable will be persisted in current environment's .env file.
    # TEAMS_APP_ID: the id of Teams app

  - uses: m365Title/acquire # Upload your app to Outlook and the Microsoft 365 app
    with:
      appPackagePath: ./build/appPackage/appPackage.${{TEAMSFX_ENV}}.zip # Relative path to the built app package.
    # Output: following environment variable will be persisted in current environment's .env file.
    # M365_TITLE_ID: the id of M365 title
    # M365_APP_ID: the app id of M365 title

deploy:
  - uses: cli/runNpmCommand # Run npm command
    with:
      args: install --no-audit

  - uses: file/createOrUpdateEnvironmentFile # Generate runtime environment variables
    with:
      target: ./.localSettings
      envs:
        BOT_ID: ${{BOT_ID}}
        BOT_PASSWORD: ${{SECRET_BOT_PASSWORD}}