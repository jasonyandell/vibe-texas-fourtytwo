/**
 * Compression utilities for URL Serialization
 */

import LZString from 'lz-string';
import { SerializedGameState, CompressionMethod, CompressionResult } from './types';

/**
 * Compresses game state using the best available method
 */
export function compressGameState(gameState: SerializedGameState, preferredMethod?: CompressionMethod): CompressionResult {
  const json = JSON.stringify(gameState);
  const originalSize = json.length;

  // Try different compression methods and pick the best one
  const methods: CompressionMethod[] = preferredMethod
    ? [preferredMethod]
    : ['lz-string-uri', 'lz-string', 'base64', 'none'];

  let bestResult: CompressionResult | null = null;

  for (const method of methods) {
    try {
      let compressed: string;

      switch (method) {
        case 'lz-string-uri':
          compressed = LZString.compressToEncodedURIComponent(json);
          break;
        case 'lz-string':
          compressed = LZString.compressToBase64(json);
          break;
        case 'base64':
          compressed = btoa(json);
          break;
        case 'none':
        default:
          compressed = json;
          break;
      }

      const result: CompressionResult = {
        data: compressed,
        method,
        originalSize,
        compressedSize: compressed.length,
        compressionRatio: compressed.length / originalSize
      };

      // Use the first successful compression, or the best ratio if trying all methods
      if (preferredMethod || !bestResult || result.compressionRatio < bestResult.compressionRatio) {
        bestResult = result;
        if (preferredMethod) break; // Use preferred method if specified
      }
    } catch (error) {
      console.warn(`Compression method ${method} failed:`, error);
      continue;
    }
  }

  if (!bestResult) {
    // Fallback to uncompressed
    return {
      data: json,
      method: 'none',
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1
    };
  }

  return bestResult;
}

/**
 * Decompresses game state from compressed string
 */
export function decompressGameState(compressed: string, method: CompressionMethod): SerializedGameState | null {
  try {
    let json: string;

    switch (method) {
      case 'lz-string-uri':
        json = LZString.decompressFromEncodedURIComponent(compressed);
        if (!json) throw new Error('LZ-string URI decompression failed');
        break;
      case 'lz-string':
        json = LZString.decompressFromBase64(compressed);
        if (!json) throw new Error('LZ-string base64 decompression failed');
        break;
      case 'base64':
        json = atob(compressed);
        break;
      case 'none':
      default:
        json = compressed;
        break;
    }

    return JSON.parse(json) as SerializedGameState;
  } catch (error) {
    console.error(`Failed to decompress game state using method ${method}:`, error);
    return null;
  }
}