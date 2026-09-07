import { T3nClient, setEnvironment, loadWasmComponent, eth_get_address, metamask_sign, createEthAuthInput, getScriptVersion, getNodeUrl } from '@terminal3/t3n-sdk';

let cached = null;
const required = n => { if (!process.env[n]) throw new Error(`${n} is not configured`); return process.env[n]; };

export async function getT3Client(){
  if(cached) return cached;
  setEnvironment(process.env.T3N_ENVIRONMENT || 'testnet');
  const wasmComponent = await loadWasmComponent();
  const address = eth_get_address(required('AGENT_KEY'));
  const client = new T3nClient({ wasmComponent, handlers:{EthSign: metamask_sign(address, undefined, required('AGENT_KEY'))} });
  await client.handshake();
  await client.authenticate(createEthAuthInput(address));
  cached = {client,address};
  return cached;
}

// The hackathon demo can point this adapter at a T3N contract that exposes
// a credential-verification function. The browser never receives the raw
// credential: only the minimum attributes needed by the policy are returned.
export async function verifyWithT3(input){
  const {client,address}=await getT3Client();
  const did=required('T3N_TENANT_DID');
  const scriptName=process.env.T3N_SCRIPT_NAME || `z:${did.slice('did:t3n:'.length)}:${process.env.T3N_CONTRACT_TAIL || 'money-guardian'}`;
  const scriptVersion=await getScriptVersion(getNodeUrl(),scriptName);
  return client.executeAndDecode({
    script_name:scriptName,
    script_version:scriptVersion,
    function_name:process.env.T3N_VERIFY_FUNCTION || 'verify-financial-credential',
    pii_did:did,
    input
  });
}

export function t3Configured(){ return Boolean(process.env.AGENT_KEY && process.env.T3N_TENANT_DID); }
