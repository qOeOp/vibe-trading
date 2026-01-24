/**
 * Service discovery client using Consul
 */

import Consul from 'consul';

/**
 * Service discovery client using Consul.
 *
 * DESIGN:
 * - Query Consul for service addresses dynamically
 * - Cache discovered addresses with TTL to reduce Consul queries
 * - Graceful degradation if Consul unavailable
 * - Fallback to environment variables
 */
export class ServiceDiscoveryClient {
  private consul: Consul.Consul | null = null;
  private serviceCache: Map<string, { address: string; timestamp: number }> = new Map();
  private cacheTTL = 30000; // 30 seconds

  constructor() {
    const consulHost = process.env.CONSUL_HOST || 'consul';
    const consulPort = parseInt(process.env.CONSUL_PORT || '8500');

    try {
      this.consul = new Consul({
        host: consulHost,
        port: consulPort,
        promisify: true,
      });
      console.log(`Consul client initialized: ${consulHost}:${consulPort}`);
    } catch (error) {
      console.warn('Failed to initialize Consul client:', error);
      this.consul = null;
    }
  }

  /**
   * Discover service address from Consul.
   * Falls back to environment variable if Consul unavailable.
   */
  async discoverService(serviceName: string, fallbackEnvVar: string): Promise<string> {
    // Check cache first
    const cached = this.serviceCache.get(serviceName);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.address;
    }

    // Try Consul discovery
    if (this.consul) {
      try {
        const result = await this.consul.health.service({
          service: serviceName,
          passing: true, // Only healthy instances
        });

        if (result && result.length > 0) {
          // Use first healthy instance
          const service = result[0];
          const address = `http://${service.Service.Address}:${service.Service.Port}`;

          // Cache the result
          this.serviceCache.set(serviceName, { address, timestamp: Date.now() });

          console.log(`Discovered ${serviceName} at ${address}`);
          return address;
        }
      } catch (error) {
        console.warn(`Consul query failed for ${serviceName}:`, error);
      }
    }

    // Fallback to environment variable
    const fallback = process.env[fallbackEnvVar];
    if (fallback) {
      console.log(`Using fallback address for ${serviceName}: ${fallback}`);
      return fallback;
    }

    throw new Error(`Cannot discover service ${serviceName} and no fallback configured`);
  }

  /**
   * Register this service with Consul.
   */
  async registerService(
    serviceName: string,
    serviceId: string,
    port: number,
    healthCheckPath: string
  ): Promise<void> {
    if (!this.consul) {
      console.warn('Consul not available, skipping service registration');
      return;
    }

    try {
      await this.consul.agent.service.register({
        id: serviceId,
        name: serviceName,
        address: process.env.SERVICE_HOST || 'api',
        port: port,
        check: {
          http: `http://${process.env.SERVICE_HOST || 'api'}:${port}${healthCheckPath}`,
          interval: '10s',
          timeout: '5s',
        },
      });

      console.log(`Registered ${serviceName} (${serviceId}) with Consul`);

      // Deregister on process exit
      process.on('SIGTERM', async () => {
        await this.deregisterService(serviceId);
      });
      process.on('SIGINT', async () => {
        await this.deregisterService(serviceId);
      });
    } catch (error) {
      console.error('Failed to register service with Consul:', error);
    }
  }

  /**
   * Deregister service from Consul.
   */
  async deregisterService(serviceId: string): Promise<void> {
    if (!this.consul) return;

    try {
      await this.consul.agent.service.deregister(serviceId);
      console.log(`Deregistered ${serviceId} from Consul`);
    } catch (error) {
      console.error('Failed to deregister service:', error);
    }
  }
}

// Singleton instance
export const serviceDiscovery = new ServiceDiscoveryClient();
