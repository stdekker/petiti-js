// Generate a short unique identifier (6 characters)
export function generateShortId() {
  // Use base36 (0-9 and a-z) for shorter strings
  // This gives us 36^6 = 2,176,782,336 possible combinations
  // Using timestamp and random number to ensure uniqueness
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 4);
  return (timestamp + random).slice(-6);
}

// Validate and sanitize share ID
export function validateShareId(id) {
  if (!id) return null;
  
  // Only allow alphanumeric characters
  // Length should be exactly 6 characters
  const sanitized = id.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
  return sanitized.length === 6 ? sanitized : null;
} 