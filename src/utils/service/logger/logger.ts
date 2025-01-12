import { downloadFile } from '../../core/file';

export interface ILogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
}

enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

class Logger {
    static #_loggerFn: (logEntry: ILogEntry) => void = (logEntry: ILogEntry) => {
        if (!window.console.modified) {
            console.log(`[${logEntry.timestamp}] [${logEntry.level}] ${logEntry.message}`);
        }
    };

    static #_log(level: LogLevel, message: string): void {
        const timestamp = new Date().toISOString();
        const logEntry = { level, timestamp, message };
        if (Array.isArray(window.logs)) {
            window.logs.push(logEntry);
        }

        this.#_loggerFn(logEntry);
    }

    static info(message: string): void {
        this.#_log(LogLevel.INFO, message);
    }

    static warn(message: string): void {
        this.#_log(LogLevel.WARN, message);
    }

    static error(message: string): void {
        this.#_log(LogLevel.ERROR, message);
    }

    static debug(message: string): void {
        this.#_log(LogLevel.DEBUG, message);
    }

    static downloadLogs(): void {
        const logs = JSON.stringify(window.logs, null, 2);
        const blob = new Blob([logs], { type: 'application/json' });
        const filename = `logs-${new Date().toISOString()}.txt`;

        downloadFile(blob, filename);
    }

    static set LoggerFn(loggerFn: (logEntry: ILogEntry) => void) {
        this.#_loggerFn = loggerFn;
    }
}

export { Logger, LogLevel };
