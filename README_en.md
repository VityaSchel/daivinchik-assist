# Дайвинчик Ассист

[README на русском](./README.md)

\[Todo: banner\]

[Download from Play Market](#) • [Download sources from GitHub](#)

❗️ Дайвинчик Ассист does not support english language yet. Create a pull request or vote in issue [here](https://github.com/VityaSchel/daivinchik-assist/issues/5). ❗️

## How it works?

Open the app in a window near to Telegram and scroll profiles!

- Windows: Open Дайвинчик Ассист in a window near to Telegram, focus on the messenger and start scrolling
- macOS: Open Дайвинчик Ассист in a window near to Telegram, focus on the messenger and start scrolling
- Linux: Open Дайвинчик Ассист in a window near to Telegram, focus on the messenger and start scrolling
- Android: Open Дайвиник Ассист in a popup window near Telegram or as a split screen app, focus on Telegram and start scrolling
- iOS: 😂

⚠️ Does not work with 2FA. [Read more](https://github.com/VityaSchel/daivinchik-assist/issues/2) ⚠️

### Features

- Profile interactions history
  - The app shows, when you saw this exact profile and how did you react
- Auto loading of Instagram-profile
  - The app loads photos and basic info from Instagram profile, if it's handle is specified in profile's text
- Profile editor
  - The app helps with profile editing: shows how many characters left for profile and how many will you have for a text-based response
- Auto-skip based on preset rules
  - Setup auto-skip based on specific rules, like blacklisted words

## Development

### Development server startup

`yarn start:standalone` starts electron-builder server and creates a hot-reload window

`start:mobile` starts expo for mobile development

### Building

`yarn build:standalone` bundles the project for PC

## Message type detecting (RegExps)

TODO