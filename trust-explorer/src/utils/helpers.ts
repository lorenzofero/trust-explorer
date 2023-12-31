import { ethers } from "ethers";
import {
  SchemaEncoder,
  ZERO_BYTES32,
} from "@ethereum-attestation-service/eas-sdk";
import { EAS } from "@ethereum-attestation-service/eas-sdk";

const EAS_CONTRACT_ADDRESS = "0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84";
const eas = new EAS(EAS_CONTRACT_ADDRESS);

export function generateSignal(
  attester: string,
  contractAddress: string,
  score: number
) {
  if (!contractAddress || !score) return;
  const signal = ethers.solidityPacked(
    ["address", "address", "uint8"],
    [attester, contractAddress, score]
  );

  return signal;
}

export async function generateAttestation(
  root: string,
  proof: string,
  nullifierHash: string,
  score: number,
  contract: string
) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  eas.connect(signer as any);
  console.log("signer", signer);
  console.log("score", score);
  console.log("contract", contract);
  if (!score || !contract) return;
  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(
    "uint8 score,uint256 root,uint256 nullifierHash,bytes proof"
  );

  const encodedData = schemaEncoder.encodeData([
    { name: "score", value: score, type: "uint8" },
    { name: "root", value: root, type: "uint256" },
    { name: "nullifierHash", value: nullifierHash, type: "uint256" },
    { name: "proof", value: proof, type: "bytes" },
  ]);

  const schemaUID =
    "0xfd1d09737b6a97b7feae8d388f71e17b8dec6cb19d10ab6fef6bc337859cdb2b";

  try {
    // const tx = await window.ethereum.request({
    //   method: "eth_sendTransaction",
    //   params: [
    //     {
    //       from: await signer.getAddress(),
    //       to: EAS_CONTRACT_ADDRESS,
    //       data:
    //         "0xf17325e7" +
    //         ethers.AbiCoder.defaultAbiCoder()
    //           .encode(
    //             ["uint256", "address", "uint256", "bool", "bytes", "uint256"],
    //             [schemaUID, contract, 0, true, encodedData, 0]
    //           )
    //           .split("0x")[1],
    //       gasLimit: "0x186a0",
    //       gasPrice: "0x4a817c800",
    //       value: 0,
    //     },
    //   ],
    // });
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: contract,
        expirationTime: 0,
        revocable: true,
        data: encodedData,
        value: 0,
        refUID: ZERO_BYTES32,
      },
    });
  } catch (e) {
    console.log("error", e);
  }
}
