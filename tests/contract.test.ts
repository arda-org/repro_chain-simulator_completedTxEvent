import { expect, test } from "vitest";
import { FSWorld } from "xsuite";

test("Doesn't have completedTxEvent", async () => {
  using world = await FSWorld.start({ gasPrice: 0 });

  const wallet1 = await world.createWallet({
    address: "erd1qyqqqqqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqslu4kj",
    kvs: { esdts: [{ id: fftId, amount: 1 }] },
  });
  const contract = await world.createContract({
    address: "erd1qqqqqqqqqqqqqpgqqqqqqpgqqqqqqqqqqqqqqqqqqqqqqqqqqqqsu78c77",
    code: "file:output/contract.wasm",
  });
  const wallet2 = await world.createWallet({
    address: "erd1qyqqqqqxqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrq8dtejy",
  });

  const txHash = await wallet1.sendCallContract({
    callee: contract,
    funcName: "transfer_received",
    funcArgs: [wallet2],
    esdts: [{ id: fftId, amount: 1 }],
    gasLimit: 10_000_000,
  });
  await world.generateBlocks(20);
  const tx = await world.proxy.getTx(txHash);
  const stringifiedTx = JSON.stringify(tx, null, 2);
  expect(stringifiedTx).not.toContain("completedTxEvent");
});

test("Has completedTxEvent", async () => {
  using world = await FSWorld.start({ gasPrice: 0 });

  const wallet1 = await world.createWallet({
    address: "erd1qyqqqqqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqslu4kj",
    kvs: { esdts: [{ id: fftId, amount: 1 }] },
  });
  const contract = await world.createContract({
    address: "erd1qqqqqqqqqqqqqpgqqqqqqpgqqqqqqqqqqqqqqqqqqqqqqqqqqqqsu78c77",
    code: "file:output/contract.wasm",
  });
  const wallet2 = await world.createWallet({
    address: "erd1qyqqqqqrqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpsrqjmjy", // Only change
  });

  const txHash = await wallet1.sendCallContract({
    callee: contract,
    funcName: "transfer_received",
    funcArgs: [wallet2],
    esdts: [{ id: fftId, amount: 1 }],
    gasLimit: 10_000_000,
  });
  await world.generateBlocks(20);
  const tx = await world.proxy.getTx(txHash);
  const stringifiedTx = JSON.stringify(tx, null, 2);
  expect(stringifiedTx).toContain("completedTxEvent");
});

const fftId = "FFT-123456"
