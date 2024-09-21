import { randomUUID } from 'crypto';
import { Literal } from '../lib/typeUtil';
import { hashSync, compareSync } from 'bcrypt';

export type CreateAccountParams = {
  name: string;
  displayName: string;
  password: string;
  affiliation: string | null;
};

export class Account {
  constructor(obj: Literal<Account>) {
    this.id = obj.id;
    this.name = obj.name;
    this.displayName = obj.displayName;
    this.password = obj.password;
    this.affiliation = obj.affiliation;
  }

  id: string;
  name: string;
  displayName: string;
  password: string;
  affiliation: string | null;

  static create(params: CreateAccountParams): Account {
    const hash = hashSync(params.password, 10);
    return new Account({
      id: randomUUID(),
      name: params.name,
      displayName: params.displayName,
      password: hash,
      affiliation: params.affiliation,
    });
  }

  checkPassword(password: string): boolean {
    return compareSync(password, this.password);
  }

  setDisplayName(displayName: string): void {
    this.displayName = displayName;
  }
}
