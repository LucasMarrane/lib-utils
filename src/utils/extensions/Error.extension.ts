import { LogLevel } from "../service/logger";

class LogError extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);      
      
        window.logs.push({ level: LogLevel.ERROR, message: this.stack ?? this.message, timestamp: new Date().toISOString() });
    }
}

export function setErrorExtension(){
    window.Error = LogError as ErrorConstructor;
}
