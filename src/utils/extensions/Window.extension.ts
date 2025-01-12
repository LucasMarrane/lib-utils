import { downloadFile } from '../core/file';
import { ILogEntry, Logger } from '../service/logger';

declare global {
    interface Window {
        logs: Array<ILogEntry>;
        logger: typeof Logger;

        console: Console & {
            modified: boolean;
        };

        downloadFile: (blob: Blob, filename: string) => void;
    
    }
}

export function setLoggerExtension() {
    window.logs = window.logs || [];
    window.logger = Logger;
}

export function setConsoleLogExtension() {
    const consoleLog = console.log;
    const consoleError = console.error;
    const consoleWarn = console.warn;

    window.console.modified = true;


    window.console.log = (...args: any[]) => {
        window.logger.info(args as any);
        consoleLog(...args);
    };

    console.error = (...args: any[]) => {
        window.logger.error(args as any);
        consoleError(...args);
    };

    console.warn = (...args: any[]) => {
        window.logger.warn(args as any);
        consoleWarn(...args);
    };
}

export function setDownloadExtension() {
    window.downloadFile = downloadFile;
}