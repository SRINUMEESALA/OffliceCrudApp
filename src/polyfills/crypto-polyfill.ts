import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';

(global as any).crypto = {
  getRandomValues: (arr: any) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  },
  subtle: {
    digest: async (algorithm: string, data: Uint8Array) => {
      const wordArray = CryptoJS.lib.WordArray.create(data);

      let hash;
      switch (algorithm.toLowerCase()) {
        case 'sha-256':
          hash = CryptoJS.SHA256(wordArray);
          break;
        case 'sha-1':
          hash = CryptoJS.SHA1(wordArray);
          break;
        case 'sha-512':
          hash = CryptoJS.SHA512(wordArray);
          break;
        default:
          hash = CryptoJS.SHA256(wordArray);
      }

      const hashWords = hash.words;
      const hashSigBytes = hash.sigBytes;
      const hashArray = new Uint8Array(hashSigBytes);

      for (let i = 0; i < hashSigBytes; i++) {
        hashArray[i] =
          (hashWords[Math.floor(i / 4)] >>> (24 - (i % 4) * 8)) & 0xff;
      }

      return hashArray;
    },
  },
} as any;

if (typeof window !== 'undefined') {
  (window as any).crypto = (global as any).crypto;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).crypto = (global as any).crypto;
}

if (typeof (global as any).TextEncoder === 'undefined') {
  (global as any).TextEncoder = class TextEncoder {
    encode(input: string): Uint8Array {
      const utf8 = unescape(encodeURIComponent(input));
      const result = new Uint8Array(utf8.length);
      for (let i = 0; i < utf8.length; i++) {
        result[i] = utf8.charCodeAt(i);
      }
      return result;
    }
  };
}

if (typeof (global as any).TextDecoder === 'undefined') {
  (global as any).TextDecoder = class TextDecoder {
    decode(input: Uint8Array): string {
      let result = '';
      for (let i = 0; i < input.length; i++) {
        result += String.fromCharCode(input[i]);
      }
      return decodeURIComponent(escape(result));
    }
  };
}
