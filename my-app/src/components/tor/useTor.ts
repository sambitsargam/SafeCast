/**
 * Tor React Hook for SafeCast
 * 
 * This hook provides React integration for Tor functionality,
 * making it easy to use Tor features in React components.
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  TorIntegrationManager, 
  TorConfig, 
  OnionService, 
  TorUtils 
} from './torIntegration';

export interface UseTorReturn {
  // Connection status
  isConnected: boolean;
  isInitializing: boolean;
  error: string | null;
  
  // Tor services
  socksConfig: string;
  activeOnionServices: OnionService[];
  availableRPCs: string[];
  
  // Actions
  initialize: () => Promise<boolean>;
  createOnionService: (port?: number) => Promise<OnionService | null>;
  makePrivateRPCCall: (rpcName: string, method: string, params?: any[]) => Promise<any>;
  shutdown: () => void;
  
  // Utilities
  checkTorAvailability: () => Promise<boolean>;
}

export function useTor(config?: TorConfig): UseTorReturn {
  const [torManager] = useState(() => new TorIntegrationManager(config));
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socksConfig, setSocksConfig] = useState('');
  const [activeOnionServices, setActiveOnionServices] = useState<OnionService[]>([]);
  const [availableRPCs, setAvailableRPCs] = useState<string[]>([]);

  // Initialize Tor connection
  const initialize = useCallback(async (): Promise<boolean> => {
    setIsInitializing(true);
    setError(null);

    try {
      const success = await torManager.initialize();
      setIsConnected(success);
      
      if (success) {
        const status = torManager.getConnectionStatus();
        setSocksConfig(status.socksConfig);
        setActiveOnionServices(torManager.getActiveOnionServices());
        setAvailableRPCs(torManager.getAvailableRPCs());
      } else {
        setError('Failed to initialize Tor connection');
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsConnected(false);
      return false;
    } finally {
      setIsInitializing(false);
    }
  }, [torManager]);

  // Create onion service
  const createOnionService = useCallback(async (port: number = 3000): Promise<OnionService | null> => {
    if (!isConnected) {
      setError('Tor is not connected');
      return null;
    }

    try {
      const service = await torManager.createSafeCastOnionService(port);
      setActiveOnionServices(torManager.getActiveOnionServices());
      return service;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create onion service';
      setError(errorMessage);
      return null;
    }
  }, [torManager, isConnected]);

  // Make private RPC call
  const makePrivateRPCCall = useCallback(async (
    rpcName: string, 
    method: string, 
    params: any[] = []
  ): Promise<any> => {
    if (!isConnected) {
      throw new Error('Tor is not connected');
    }

    try {
      return await torManager.makePrivateCall(rpcName, method, params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'RPC call failed';
      setError(errorMessage);
      throw err;
    }
  }, [torManager, isConnected]);

  // Shutdown Tor
  const shutdown = useCallback(() => {
    torManager.shutdown();
    setIsConnected(false);
    setSocksConfig('');
    setActiveOnionServices([]);
    setAvailableRPCs([]);
    setError(null);
  }, [torManager]);

  // Check Tor availability
  const checkTorAvailability = useCallback(async (): Promise<boolean> => {
    try {
      return await TorUtils.checkTorAvailability();
    } catch (err) {
      setError('Failed to check Tor availability');
      return false;
    }
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    const autoInit = async () => {
      const isAvailable = await checkTorAvailability();
      if (isAvailable) {
        await initialize();
      } else {
        setError('Tor is not available on this system');
      }
    };

    autoInit();

    // Cleanup on unmount
    return () => {
      shutdown();
    };
  }, [initialize, checkTorAvailability, shutdown]);

  return {
    isConnected,
    isInitializing,
    error,
    socksConfig,
    activeOnionServices,
    availableRPCs,
    initialize,
    createOnionService,
    makePrivateRPCCall,
    shutdown,
    checkTorAvailability,
  };
}

/**
 * Hook for Tor connection status display
 */
export function useTorStatus() {
  const tor = useTor();
  
  const getStatusColor = () => {
    if (tor.isInitializing) return 'yellow';
    if (tor.isConnected) return 'green';
    if (tor.error) return 'red';
    return 'gray';
  };

  const getStatusText = () => {
    if (tor.isInitializing) return 'Connecting to Tor...';
    if (tor.isConnected) return 'Connected to Tor';
    if (tor.error) return `Error: ${tor.error}`;
    return 'Not connected';
  };

  return {
    ...tor,
    statusColor: getStatusColor(),
    statusText: getStatusText(),
  };
}

/**
 * Hook for private RPC operations
 */
export function usePrivateRPC() {
  const tor = useTor();

  const callEthereumRPC = useCallback(async (method: string, params: any[] = []) => {
    return await tor.makePrivateRPCCall('ethereum-mainnet', method, params);
  }, [tor]);

  const callPolygonRPC = useCallback(async (method: string, params: any[] = []) => {
    return await tor.makePrivateRPCCall('polygon', method, params);
  }, [tor]);

  const callArbitrumRPC = useCallback(async (method: string, params: any[] = []) => {
    return await tor.makePrivateRPCCall('arbitrum', method, params);
  }, [tor]);

  return {
    ...tor,
    callEthereumRPC,
    callPolygonRPC,
    callArbitrumRPC,
  };
}
