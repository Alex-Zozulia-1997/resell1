import crypto from 'crypto';

// Secret key for encoding/decoding (in production, store this in environment variables)
const ENCODING_SECRET = process.env.EMAIL_ENCODING_SECRET || 'ipden-default-secret-key-2026';

/**
 * Encodes an email address to protect client privacy when sending to Geonode
 * Creates a consistent hash that can be used as identifier
 */
export function encodeEmail(email: string): string {
  // Create a consistent hash of the email
  const hash = crypto.createHmac('sha256', ENCODING_SECRET).update(email.toLowerCase()).digest('hex');
  
  // Take first 16 characters to keep it manageable while maintaining uniqueness
  const shortHash = hash.substring(0, 16);
  
  // Add a prefix to identify these as encoded emails
  return `user_${shortHash}@encoded.local`;
}

/**
 * Decodes an email address back to original (if it was encoded)
 * Returns the original email if it wasn't encoded
 */
export function decodeEmail(encodedEmail: string): string {
  // If this is not an encoded email, return as-is
  if (!encodedEmail.includes('@encoded.local')) {
    return encodedEmail;
  }
  
  // For decoding, we'd need to maintain a mapping since hashing is one-way
  // This function is primarily for consistency - we'll store the original email mapping
  console.warn('Attempting to decode hashed email - this requires database lookup');
  return encodedEmail; // Return encoded version if no mapping available
}

/**
 * Checks if an email is encoded
 */
export function isEncodedEmail(email: string): boolean {
  return email.includes('@encoded.local') && email.startsWith('user_');
}

/**
 * Creates a mapping entry for email encoding
 * This should be called when we first encode an email to maintain the relationship
 */
export function createEmailMapping(originalEmail: string, encodedEmail?: string) {
  const encoded = encodedEmail || encodeEmail(originalEmail);
  
  // In a real implementation, you'd store this mapping in your database
  // For now, we'll return the mapping object for manual storage
  return {
    original: originalEmail.toLowerCase(),
    encoded: encoded,
    createdAt: new Date().toISOString()
  };
}