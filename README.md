# VS Code Timer - Extension

Track your coding time in Visual Studio Code with this lightweight extension. Automatically records both your current session time and total coding time across all sessions.

### Features
    ⏱️ Real-time tracking of your coding sessions

    📊 Separate counters for current session and total time

    📍 Status bar integration showing both session and total time

    💾 Persistent storage - your data survives restarts and updates

    📈 Accurate tracking - pauses when VS Code loses focus

    💻 Multi-window support - works across multiple VS Code instances

### Installation
    Open VS Code

    Go to Extensions view (Ctrl+Shift+X)

    Search for "VS Code Timer"

    Click Install

Note: This is an alpha version - please report any issues you encounter!

Usage
After installation, the timer starts automatically:

Status Bar: Shows your total and session time in the bottom right corner
Format: Время: Total: 00:00:00 | Session: 00:00:00

### Commands:

    Show Coding Time: Display current times in a notification
    (Open command palette with Ctrl+Shift+P and type "Show Coding Time")

### Automatic Saving:

    Timer pauses when VS Code loses focus

    Data saves every 5 minutes and when closing VS Code

### Data Storage
    Your coding time data is stored securely in VS Code's extension storage:

    Location: ~/.vscode/extensions/your-id.vscode-timer/data/usage.db

    Format: SQLite database (local, private, never leaves your machine)

### Requirements
    Visual Studio Code v1.82.0 or higher

    Node.js v16+ (bundled with VS Code)

### Known Issues (Alpha)
    Initial activation may take 5-10 seconds after VS Code starts

    Rare timing discrepancies when rapidly switching focus

    Database location might change in future versions

### Future Plans
    Add daily/weekly/monthly breakdowns

    Export data to CSV/JSON

    Customizable status bar format

    Pomodoro timer integration

    Productivity insights dashboard

### Contributing
    This project is in early alpha. Contributions are welcome! Please report issues or suggest features in the GitHub repository.

### License
    MIT License - see LICENSE for details

Version 0.2.0-alpha\
Released: August 2025\
*For VS Code 1.82+*\
Important: This alpha version may contain bugs. Data format may change in future releases.