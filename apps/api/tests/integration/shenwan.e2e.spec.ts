/**
 * End-to-end integration test
 * Requires both api and market-data services running
 */

describe('Shenwan API Integration', () => {
  const API_URL = process.env.API_URL || 'http://localhost:3000';

  it('should fetch first-level industries through full service chain', async () => {
    const response = await fetch(`${API_URL}/api/shenwan/industries/first`);

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('code');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('constituent_count');
    }
  }, 30000);

  it('should fetch second-level industries through full service chain', async () => {
    const response = await fetch(`${API_URL}/api/shenwan/industries/second`);

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('code');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('parent_industry');
    }
  }, 30000);

  it('should fetch third-level industries through full service chain', async () => {
    const response = await fetch(`${API_URL}/api/shenwan/industries/third`);

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(200); // Should have 260+ categories

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('code');
      expect(data[0]).toHaveProperty('name');
    }
  }, 30000);

  it('should fetch industry constituents through full service chain', async () => {
    // First get third-level industries to get a valid symbol
    const industriesResponse = await fetch(`${API_URL}/api/shenwan/industries/third`);
    expect(industriesResponse.ok).toBe(true);

    const industries = await industriesResponse.json();
    expect(industries.length).toBeGreaterThan(0);

    const testSymbol = industries[0].code;

    // Now fetch constituents for that symbol
    const response = await fetch(`${API_URL}/api/shenwan/constituents/${testSymbol}`);

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('stock_code');
      expect(data[0]).toHaveProperty('stock_name');
      expect(data[0]).toHaveProperty('sw_level1');
      expect(data[0]).toHaveProperty('sw_level2');
      expect(data[0]).toHaveProperty('sw_level3');
    }
  }, 30000);
});
