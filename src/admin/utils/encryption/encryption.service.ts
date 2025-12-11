import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import * as crypto from 'crypto';


@Injectable()
export class EncryptionService {
    private readonly ALGORITHM = 'aes-256-cbc';
    private readonly ENCODING = 'hex';
    private readonly secretKey : string ;
    private readonly iv_length : number ;
    private readonly key : Buffer ;
    constructor(configService : ConfigService){
        this.secretKey = configService.getOrThrow('ENCRYPTION_KEY');
        this.iv_length = Number(configService.getOrThrow('ENCRYPTION_IV_LENGTH'));
        this.key = crypto.createHash('sha256').update(String(this.secretKey)).digest();
    }
    
    encryptionCredential (text : string) : string {
        const iv = randomBytes(this.iv_length);

        const cipher = createCipheriv(this.ALGORITHM, this.key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString(this.ENCODING)}:${encrypted.toString(this.ENCODING)}`;
    }

    decryptCredential (text : string) : string {
        const [ivHex, encryptHex] = text.split(':');
        if(!ivHex || !encryptHex) {
            throw new Error('Sai định dạng mã hóa');
        }
        const iv = Buffer.from(ivHex, this.ENCODING);
        const encyptedText = Buffer.from(encryptHex, this.ENCODING);
        const decipher = createDecipheriv(this.ALGORITHM, this.key, iv);
        let decrypted = decipher.update(encyptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
