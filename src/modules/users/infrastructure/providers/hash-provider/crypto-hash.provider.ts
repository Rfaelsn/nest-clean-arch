import { HashProvider } from '@/shared/application/providers/hash-provider';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

export class CryptoHashProvider implements HashProvider {
  constructor(private readonly configService: ConfigService) {}

  async generateHash(payload: string): Promise<string> {
    const saltSecret = await this.configService.get('hashSaltSecret');
    const payloadAndSaltSecret = `${payload}${saltSecret}`;

    const createHashSha256 = createHash('sha256')
      .update(payloadAndSaltSecret)
      .digest('hex');

    return createHashSha256;
  }

  async compareHash(payload: string, hash: string): Promise<boolean> {
    const newHash = await this.generateHash(payload);

    return newHash === hash;
  }
}
