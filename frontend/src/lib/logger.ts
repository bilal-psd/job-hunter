type LogLevel = 'info' | 'debug' | 'warn' | 'error';

interface LogOptions {
  level?: LogLevel;
  timestamp?: boolean;
  context?: string;
  error?: string | undefined;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(message: string, options: LogOptions = {}): string {
    const { timestamp = true, context, error } = options;
    const timeStr = timestamp ? `[${new Date().toISOString()}]` : '';
    const contextStr = context ? `[${context}]` : '';
    const errorStr = error ? `\nError details: ${error}` : '';
    return `${timeStr}${contextStr} ${message}${errorStr}`;
  }

  private log(level: LogLevel, message: string, options: LogOptions = {}) {
    if (level === 'debug' && !this.isDevelopment) return;

    const formattedMessage = this.formatMessage(message, options);
    
    switch (level) {
      case 'info':
        console.info(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }

  public info(message: string, options?: LogOptions) {
    this.log('info', message, options);
  }

  public debug(message: string, options?: LogOptions) {
    this.log('debug', message, options);
  }

  public warn(message: string, options?: LogOptions) {
    this.log('warn', message, options);
  }

  public error(message: string, options?: LogOptions) {
    this.log('error', message, options);
  }
}

export const logger = Logger.getInstance(); 