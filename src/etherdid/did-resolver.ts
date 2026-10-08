// import { Resolver } from "did-resolver";
// import { getResolver } from "ethr-did-resolver";
// import "dotenv/config";

// const ethrResolver = getResolver({
//   networks: [
//     {
//       name: "0x13882",
//       rpcUrl: process.env.POLYGON_AMOY_RPC_URL!,
//     },
//   ],
// });

// export const didResolver = new Resolver(ethrResolver);

import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import "dotenv/config";

const ethrDidResolver = getResolver({
  name: "0x13882",
  rpcUrl: process.env.POLYGON_AMOY_RPC_URL!,
  registry: "0x61932A29e301BD7eD3C9CA32e950464b073BcF96"
});

export const resolver = new Resolver(ethrDidResolver);