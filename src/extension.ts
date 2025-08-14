import * as vscode from 'vscode';
import DatabaseService from './services/database';

export function activate(context: vscode.ExtensionContext) {
    console.log("Timer extension activated");
    console.log("Node.js version:", process.version);
    console.log("Electron version:", process.versions.electron);
    console.log("NODE_MODULE_VERSION:", process.versions.modules);

    const dbService = new DatabaseService(context);
    let sessionSeconds = 0;
    let sessionTotalSeconds = 0;
    let isActive = vscode.window.state.focused;
    let statusBarItem: vscode.StatusBarItem;

    function initStatusBar() {
        if (statusBarItem) {
            statusBarItem.dispose();
        }
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.show();
        return statusBarItem;
    }

    function formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateStatusBar() {
        try {
            const totalSeconds = dbService.getTotalSeconds() + sessionSeconds;
            statusBarItem.text = `Время: Total: ${formatTime(totalSeconds)} | Session: ${formatTime(sessionTotalSeconds)}`;
        } catch (error) {
            console.error("Status bar update error:", error);
        }
    }

    let interval: NodeJS.Timeout | undefined;
    statusBarItem = initStatusBar();
    updateStatusBar();

    function startTimer() {
        if (isActive && !interval) {
            interval = setInterval(() => {
                sessionSeconds++;
                sessionTotalSeconds++;
                updateStatusBar();
                
                if (sessionSeconds % 300 === 0) {
                    dbService.addTime(300);
                    sessionSeconds = 0;
                }
            }, 1000);
        }
    }

    function stopTimer() {
        if (interval) {
            clearInterval(interval);
            interval = undefined;
        }
    }

    const windowStateListener = vscode.window.onDidChangeWindowState(state => {
        isActive = state.focused;
        if (isActive) {
            startTimer();
        } else {
            stopTimer();
            if (sessionSeconds > 0) {
                dbService.addTime(sessionSeconds);
                sessionSeconds = 0;
            }
            updateStatusBar();
        }
    });

    const commandHandler = vscode.commands.registerCommand('vscodetimer.showtime', () => {
        const total = dbService.getTotalSeconds() + sessionSeconds;
        vscode.window.showInformationMessage(
            `Общее время: ${formatTime(total)}\nТекущая сессия: ${formatTime(sessionSeconds)}`
        );
    });

    context.subscriptions.push({
        dispose: () => {
            stopTimer();
            if (sessionSeconds > 0) {
                dbService.addTime(sessionSeconds);
            }
            dbService.close();
            statusBarItem.dispose();
        }
    });

    context.subscriptions.push(
        windowStateListener,
        commandHandler
    );

    if (isActive) {
        startTimer();
    }
}
export function deactivate() {
    return;
}