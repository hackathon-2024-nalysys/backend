export interface SessionInterface {
  setAccount(id: string): Promise<void>;
  getAccountId(): string | null;
  clear(): void;
}
