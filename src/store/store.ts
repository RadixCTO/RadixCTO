import { writable } from 'svelte/store';

import type {
    RadixDappToolkit,
    WalletDataState,
  } from "@radixdlt/radix-dapp-toolkit";

// import type { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";

export const login = writable(false);
export const persona = writable("None");
export const cuenta = writable("None");

// export const gatewayApi = writable<null | GatewayApiClient>(null);
export const rdt = writable<null | RadixDappToolkit>(null);
export const walletData = writable<null | WalletDataState>(null);
