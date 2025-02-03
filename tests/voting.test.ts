import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can vote for a listing with valid rating",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("voting", "vote-for-listing", [
        types.uint(0),
        types.uint(5)
      ], wallet_1.address)
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Cannot vote with invalid rating",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("voting", "vote-for-listing", [
        types.uint(0),
        types.uint(6)
      ], wallet_1.address)
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(202);
  },
});

Clarinet.test({
  name: "Cannot vote twice for same listing",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("voting", "vote-for-listing", [
        types.uint(0),
        types.uint(4)
      ], wallet_1.address)
    ]);
    
    block.receipts[0].result.expectOk().expectBool(true);
    
    block = chain.mineBlock([
      Tx.contractCall("voting", "vote-for-listing", [
        types.uint(0), 
        types.uint(3)
      ], wallet_1.address)
    ]);
    
    block.receipts[0].result.expectErr().expectUint(201);
  },
});
