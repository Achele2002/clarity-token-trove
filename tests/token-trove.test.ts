import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can create new token listing",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("token-trove", "create-listing", [
        types.utf8("Test Token"),
        types.utf8("FT"),
        types.utf8("Test Description"),
        types.principal(wallet_1.address)
      ], wallet_1.address)
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectUint(0);
  },
});

Clarinet.test({
  name: "Can get listing details",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    // test implementation
  },
});
