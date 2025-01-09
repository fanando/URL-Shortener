/**
 * @fileoverview Unit tests for a utility function
 */

const { generateShortId } = require('../../src/utils/utils');

describe('generateShortId', () => {
  it('should generate a string of length 6 (example)', () => {
    const shortId = generateShortId();
    expect(shortId).toHaveLength(6);
  });

  it('should generate different IDs each time (statistically)', () => {
    const id1 = generateShortId();
    const id2 = generateShortId();
    expect(id1).not.toBe(id2);
  });
});
