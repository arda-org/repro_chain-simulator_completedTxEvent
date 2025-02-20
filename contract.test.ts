import { expect, test } from "vitest";
import { FSWorld } from "xsuite";

test("Doesn't have completedTxEvent", async () => {
  using world = await FSWorld.start({ gasPrice: 0 });
  // using world = FSWorld.new({
  //   proxyUrl: "http://localhost:37113",
  //   gasPrice: 0,
  // });

  await world.advanceToEpoch(2);

  const wallet1 = await world.createWallet({
    address: { shard: 0 },
    kvs: { esdts: [{ id: fftId, amount: 1 }] },
  });
  const contract = await world.createContract({
    address: { shard: 1 },
    code: "file:output/contract.wasm",
  });
  const wallet2 = await world.createWallet({
    address: { shard: 2 },
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

  await world.advanceToEpoch(2);

  const wallet1 = await world.createWallet({
    address: { shard: 0 },
    kvs: { esdts: [{ id: fftId, amount: 1 }] },
  });
  const contract = await world.createContract({
    address: { shard: 1 },
    code: "file:output/contract.wasm",
  });
  const wallet2 = await world.createWallet({
    address: { shard: 1 }, // only change
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
