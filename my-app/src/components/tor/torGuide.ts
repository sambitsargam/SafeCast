/**
 * Tor Configuration Guide for SafeCast
 * 
 * This file contains instructions and examples for setting up Tor
 * integration with SafeCast for the hackathon submission.
 */

export const TOR_SETUP_GUIDE = `
# Tor Setup Guide for SafeCast

## Prerequisites

1. **Install Tor Browser or Tor Service**
   - Download from: https://www.torproject.org/download/
   - Or install Tor service: \`brew install tor\` (macOS) / \`apt install tor\` (Ubuntu)

2. **Verify Tor Installation**
   - Check if Tor is running: \`ps aux | grep tor\`
   - Default SOCKS5 port: 9050
   - Default control port: 9051

## Configuration

### 1. Basic Tor Configuration
\`\`\`typescript
import { TorIntegrationManager, DEFAULT_TOR_CONFIG } from './torIntegration';

const torConfig = {
  socksPort: 9050,        // Default SOCKS5 port
  controlPort: 9051,      // Default control port
  dataDirectory: './tor-data',
  enableOnionServices: true
};

const torManager = new TorIntegrationManager(torConfig);
\`\`\`

### 2. React Hook Usage
\`\`\`typescript
import { useTor } from './useTor';

function MyComponent() {
  const { 
    isConnected, 
    initialize, 
    createOnionService,
    makePrivateRPCCall 
  } = useTor();

  // Initialize Tor connection
  useEffect(() => {
    initialize();
  }, []);

  // Create onion service
  const handleCreateService = async () => {
    const service = await createOnionService(3000);
    console.log('Onion service:', service);
  };

  // Make private RPC call
  const handleRPCCall = async () => {
    try {
      const result = await makePrivateRPCCall(
        'ethereum-mainnet', 
        'eth_blockNumber', 
        []
      );
      console.log('RPC result:', result);
    } catch (error) {
      console.error('RPC call failed:', error);
    }
  };
}
\`\`\`

### 3. SOCKS5 Proxy Configuration
\`\`\`typescript
// For web3 providers
const provider = new ethers.providers.JsonRpcProvider({
  url: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY',
  // Configure proxy for Tor routing
  agent: new HttpsProxyAgent('socks5://127.0.0.1:9050')
});
\`\`\`

## Demo Implementation

### SafeCast Tor Integration Features:

1. **Private RPC Calls**
   - Ethereum mainnet through Tor
   - Polygon through Tor
   - Arbitrum through Tor

2. **Onion Services**
   - Create SafeCast onion service
   - Access SafeCast via .onion address
   - Censorship-resistant access

3. **SOCKS5 Proxy**
   - Route all traffic through Tor
   - Hide IP addresses
   - Prevent metadata leakage

## Testing

### 1. Test Tor Connection
\`\`\`bash
# Check if Tor is running
curl --socks5 127.0.0.1:9050 https://check.torproject.org/api/ip

# Should return Tor IP address
\`\`\`

### 2. Test Onion Service
\`\`\`bash
# Create onion service and test access
# (Implementation depends on Tor service configuration)
\`\`\`

### 3. Test Private RPC
\`\`\`typescript
// Test private RPC call through Tor
const result = await torManager.makePrivateCall(
  'ethereum-mainnet',
  'eth_getBalance',
  ['0x...', 'latest']
);
\`\`\`

## Security Considerations

1. **Key Management**
   - Store Tor keys securely
   - Use environment variables for sensitive data
   - Implement proper key rotation

2. **Network Security**
   - Always use HTTPS with Tor
   - Validate SSL certificates
   - Implement proper error handling

3. **Privacy Protection**
   - Don't leak metadata
   - Use Tor-friendly user agents
   - Implement proper session management

## Troubleshooting

### Common Issues:

1. **Tor Not Running**
   - Start Tor service: \`sudo systemctl start tor\`
   - Check ports: \`netstat -tlnp | grep 9050\`

2. **SOCKS5 Connection Failed**
   - Verify Tor configuration
   - Check firewall settings
   - Test with curl command

3. **RPC Calls Failing**
   - Verify Tor connection
   - Check RPC endpoint URLs
   - Test with simple requests first

## Integration with SafeCast

SafeCast uses Tor for:
- Private RPC submissions to Ethereum
- Censorship-resistant message broadcasting
- Anonymous wallet connections
- Resilient network access

This ensures that SafeCast works even in restricted network environments and protects user privacy.
`;

export const TOR_EXAMPLES = {
  // Example Tor configuration for different environments
  development: {
    socksPort: 9050,
    controlPort: 9051,
    dataDirectory: './dev-tor-data',
    enableOnionServices: true,
  },
  
  production: {
    socksPort: 9050,
    controlPort: 9051,
    dataDirectory: '/var/lib/tor/safecast',
    enableOnionServices: true,
  },
  
  // Example RPC configurations
  rpcEndpoints: {
    ethereum: {
      url: 'https://eth-mainnet.g.alchemy.com/v2/demo',
      socksProxy: 'socks5://127.0.0.1:9050',
      timeout: 30000,
    },
    polygon: {
      url: 'https://polygon-rpc.com',
      socksProxy: 'socks5://127.0.0.1:9050',
      timeout: 30000,
    },
  },
  
  // Example onion service configuration
  onionService: {
    port: 3000,
    serviceId: 'safecast1234567890',
    privateKey: 'ED25519-V3:...',
    publicKey: 'ED25519-V3:...',
  },
};

export const TOR_COMMANDS = {
  // Useful Tor commands for development
  startTor: 'sudo systemctl start tor',
  stopTor: 'sudo systemctl stop tor',
  restartTor: 'sudo systemctl restart tor',
  checkTorStatus: 'sudo systemctl status tor',
  testTorConnection: 'curl --socks5 127.0.0.1:9050 https://check.torproject.org/api/ip',
  checkTorLogs: 'sudo journalctl -u tor -f',
};

export default {
  TOR_SETUP_GUIDE,
  TOR_EXAMPLES,
  TOR_COMMANDS,
};
