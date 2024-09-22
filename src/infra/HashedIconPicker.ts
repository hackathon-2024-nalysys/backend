import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HashedIconPicker {
  icons = fs.readdirSync(path.join(__dirname, '../../assets/icons'));

  pickIcon(accountId: string): string {
    const iconIndex = this.hash(accountId) % this.icons.length;
    return this.icons[iconIndex];
  }

  private hash(accountId: string): number {
    let hash = 0;
    for (let i = 0; i < accountId.length; i++) {
      hash = (hash << 5) - hash + accountId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
