<script>
    import {
       DataRequestBuilder,
       RadixDappToolkit,
       RadixNetwork,
       Logger,
   } from "@radixdlt/radix-dapp-toolkit";

   import { cuenta, persona, login, walletData, rdt } from '../store/store';
   import { onMount } from "svelte"
   
    const dAppDefinitionAddress = "account_tdx_2_12y6hgqr2hnuqjw50cr2muj8trlvw7cjyxu26aqr0cpd3kzph759nvz";


   onMount(() => {

        
          $rdt = RadixDappToolkit({
          networkId: RadixNetwork.Stokenet,
          applicationVersion: "0.0.1",
          applicationName: "RadixCTO",
          applicationDappDefinitionAddress: dAppDefinitionAddress,
          logger: Logger(1),
       });

       $rdt?.buttonApi.setTheme('radix-blue') //nonexistent
     
       $rdt?.walletApi.setRequestData(
            DataRequestBuilder.persona().withProof(),
            DataRequestBuilder.accounts().exactly(1).withProof()
            //DataRequestBuilder.accounts().exactly(1)
        );

       $rdt?.walletApi.provideChallengeGenerator(getChallenge);

       $rdt?.walletApi.walletData$.subscribe(async (state) => {
           // verify the proof ROLA
           const valid = await verifyRola(state.proofs[0]);
            if (valid.verification != 'successful') {
                // raise error
                throw new Error("Authentication failed!");
            } else {
                $walletData = state;
                console.log("ROLA:", valid.verification)
            };

           if (state.persona != null)  {
              $login = true;
               persona.update((n) => state.persona.identityAddress);
               cuenta.update((n) => state.accounts[0].address);
           } else {
            $login = false;
               persona.update((n) => "None"); 
               cuenta.update((n) => "None"); 
           }
       })

   });



const getChallenge = async () => {
  let challenge = '';

  const params = {
    'applicationName': 'Radix_CTO',        // your dApp name as defined in the console
    'dAppDefinitionAddress': 'account_tdx_2_12y6hgqr2hnuqjw50cr2muj8trlvw7cjyxu26aqr0cpd3kzph759nvz',     // your dApp account address as defined in the console
    'networkId': 2,                             // 1 = mainnet, 2 = testnet
    'expectedOrigin': 'https://radixcto.pages.dev', // the exact domain, use http://localhost:3000 for local development
    'expires': 900                              // 15 minutes in this case
  };

  try {
    const requestOptionsRCV = {
      method: "POST",
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + "w4ZPIFRurhi1s4MkCLn0adZVVzuuWE3PotEtEm7HAm8",
      },
      body: JSON.stringify(params),
    };

    const result = await fetch(
      'https://stokenet.radixapi.net/v1/challenge/create',
      requestOptionsRCV
    ).then((res) => res.json());
    
    challenge = result.challenge;
    
  } catch (error) {
    console.log("Error during challenge/create: ", error);
  }
  
  return new Promise((resolve, reject) => {
    resolve(challenge);
  });
};

const verifyRola = async (personaProof) => {
  let valid = false;

  // all these params come from the rdt
  const params = {
    'type': personaProof.type,
    'challenge': personaProof.challenge,
    'proof': {
      'publicKey': personaProof.proof.publicKey,
      'signature': personaProof.proof.signature,
      'curve': personaProof.proof.curve
    },
    'address': personaProof.address
  };
 
  const requestOptionsRCV = {
    method: "POST",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + "w4ZPIFRurhi1s4MkCLn0adZVVzuuWE3PotEtEm7HAm8",
    },
    body: JSON.stringify(params),
  };

  try {
    const result = await fetch(
      'https://stokenet.radixapi.net/v1/challenge/verify',
      requestOptionsRCV 
    ).then((res) => res.json());
  
    valid = result;
    
  } catch (error) {
    console.log("Error during challenge/verify: ", error);
  }
  return valid;
};

   

</script>

<style>
  radix-connect-button  {
  
    --radix-connect-button-width: 32px;
  --radix-connect-button-height: 32px;
  --radix-connect-button-border-radius: 9999px;
  }
</style>

<radix-connect-button />