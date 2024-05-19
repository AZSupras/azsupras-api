import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly log = new Logger(HashService.name);
  constructor() {}

  hashSync(input: string): string {
    if (!input) throw new Error('Invalid input');
    return bcrypt.hashSync(input, 10);
  }

  compareSync(input: string, hash: string): boolean {
    if (!input || !hash) throw new Error('Invalid input or hash');
    return bcrypt.compareSync(input, hash);
  }

  async hash(input: string): Promise<string> {
    if (!input) throw new Error('Invalid input');
    return bcrypt.hash(input, 10);
  }

  async compare(input: string, hash: string): Promise<boolean> {
    if (!input || !hash) throw new Error('Invalid input or hash');
    return bcrypt.compare(input, hash);
  }
}
