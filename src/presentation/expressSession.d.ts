declare module 'express-session' {
  export interface SessionData {
    accountId: string | null;
  }
}

export {};
