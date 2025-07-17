/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/yield_app.json`.
 */
export type YieldApp = {
  address: 'HaegidjNb9UFKVdvRr4zj4ddgLGe6BXMLHxsVxUVndgF';
  metadata: {
    name: 'yieldApp';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'cancelOrder';
      discriminator: [95, 129, 237, 240, 8, 49, 223, 132];
      accounts: [
        {
          name: 'market';
          writable: true;
        },
        {
          name: 'order';
          writable: true;
        },
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'ownerTokenAccount';
          writable: true;
        },
        {
          name: 'escrowTokenAccount';
          writable: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
      ];
      args: [];
    },
    {
      name: 'createMarket';
      discriminator: [103, 226, 97, 235, 200, 188, 251, 254];
      accounts: [
        {
          name: 'market';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 97, 114, 107, 101, 116];
              },
              {
                kind: 'account';
                path: 'strategy';
              },
            ];
          };
        },
        {
          name: 'strategy';
        },
        {
          name: 'yieldTokenMint';
        },
        {
          name: 'baseTokenMint';
        },
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'rent';
          address: 'SysvarRent111111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'feeRate';
          type: 'u64';
        },
      ];
    },
    {
      name: 'createStrategy';
      discriminator: [152, 160, 107, 148, 245, 190, 127, 224];
      accounts: [
        {
          name: 'strategy';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [115, 116, 114, 97, 116, 101, 103, 121];
              },
              {
                kind: 'arg';
                path: 'tokenAddress';
              },
              {
                kind: 'arg';
                path: 'rewardApy';
              },
            ];
          };
        },
        {
          name: 'tokenAddressYield';
          writable: true;
          signer: true;
        },
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'rent';
          address: 'SysvarRent111111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'tokenAddress';
          type: 'pubkey';
        },
        {
          name: 'rewardApy';
          type: 'u64';
        },
      ];
    },
    {
      name: 'deposit';
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182];
      accounts: [
        {
          name: 'strategy';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [115, 116, 114, 97, 116, 101, 103, 121];
              },
              {
                kind: 'account';
                path: 'strategy.token_address';
                account: 'strategy';
              },
              {
                kind: 'account';
                path: 'strategy.reward_apy';
                account: 'strategy';
              },
            ];
          };
        },
        {
          name: 'strategyTokenAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                ];
              },
              {
                kind: 'account';
                path: 'strategy.token_address';
                account: 'strategy';
              },
              {
                kind: 'account';
                path: 'strategy.reward_apy';
                account: 'strategy';
              },
            ];
          };
        },
        {
          name: 'tokenMint';
        },
        {
          name: 'deposit';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [100, 101, 112, 111, 115, 105, 116];
              },
              {
                kind: 'account';
                path: 'signer';
              },
              {
                kind: 'account';
                path: 'strategy.token_address';
                account: 'strategy';
              },
              {
                kind: 'account';
                path: 'strategy.reward_apy';
                account: 'strategy';
              },
            ];
          };
        },
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'userTokenAccount';
          writable: true;
        },
        {
          name: 'userYieldTokenAccount';
          writable: true;
        },
        {
          name: 'yieldTokenMint';
          writable: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'rent';
          address: 'SysvarRent111111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'executeTrade';
      discriminator: [77, 16, 192, 135, 13, 0, 106, 97];
      accounts: [
        {
          name: 'market';
          writable: true;
        },
        {
          name: 'buyOrder';
          writable: true;
        },
        {
          name: 'sellOrder';
          writable: true;
        },
        {
          name: 'buyerYtAccount';
          writable: true;
        },
        {
          name: 'buyerBaseAccount';
          writable: true;
        },
        {
          name: 'sellerYtAccount';
          writable: true;
        },
        {
          name: 'sellerBaseAccount';
          writable: true;
        },
        {
          name: 'escrowYtAccount';
          writable: true;
        },
        {
          name: 'escrowBaseAccount';
          writable: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'tradeQuantity';
          type: 'u64';
        },
      ];
    },
    {
      name: 'placeOrder';
      discriminator: [51, 194, 155, 175, 109, 130, 96, 106];
      accounts: [
        {
          name: 'order';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [111, 114, 100, 101, 114];
              },
              {
                kind: 'account';
                path: 'market';
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'market';
          writable: true;
        },
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'ownerTokenAccount';
          writable: true;
        },
        {
          name: 'escrowTokenAccount';
          writable: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'rent';
          address: 'SysvarRent111111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'orderType';
          type: {
            defined: {
              name: 'orderType';
            };
          };
        },
        {
          name: 'side';
          type: {
            defined: {
              name: 'orderSide';
            };
          };
        },
        {
          name: 'price';
          type: 'u64';
        },
        {
          name: 'quantity';
          type: 'u64';
        },
        {
          name: 'expiresInSeconds';
          type: 'i64';
        },
      ];
    },
    {
      name: 'redeem';
      discriminator: [184, 12, 86, 149, 70, 196, 97, 225];
      accounts: [
        {
          name: 'strategy';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [115, 116, 114, 97, 116, 101, 103, 121];
              },
              {
                kind: 'account';
                path: 'strategy.token_address';
                account: 'strategy';
              },
              {
                kind: 'account';
                path: 'strategy.reward_apy';
                account: 'strategy';
              },
            ];
          };
        },
        {
          name: 'strategyTokenAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                ];
              },
              {
                kind: 'account';
                path: 'strategy.token_address';
                account: 'strategy';
              },
              {
                kind: 'account';
                path: 'strategy.reward_apy';
                account: 'strategy';
              },
            ];
          };
        },
        {
          name: 'userTokenAccount';
          writable: true;
        },
        {
          name: 'userYieldTokenAccount';
          writable: true;
        },
        {
          name: 'yieldTokenMint';
          writable: true;
        },
        {
          name: 'deposit';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [100, 101, 112, 111, 115, 105, 116];
              },
              {
                kind: 'account';
                path: 'signer';
              },
              {
                kind: 'account';
                path: 'strategy.token_address';
                account: 'strategy';
              },
              {
                kind: 'account';
                path: 'strategy.reward_apy';
                account: 'strategy';
              },
            ];
          };
        },
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
      ];
      args: [
        {
          name: 'withPenalty';
          type: 'bool';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'depositState';
      discriminator: [203, 5, 16, 65, 63, 206, 55, 194];
    },
    {
      name: 'market';
      discriminator: [219, 190, 213, 55, 0, 227, 198, 154];
    },
    {
      name: 'order';
      discriminator: [134, 173, 223, 185, 77, 86, 28, 51];
    },
    {
      name: 'strategy';
      discriminator: [174, 110, 39, 119, 82, 106, 169, 102];
    },
  ];
  events: [
    {
      name: 'cancelOrderEvent';
      discriminator: [174, 66, 141, 17, 4, 224, 162, 77];
    },
    {
      name: 'createMarketEvent';
      discriminator: [192, 85, 193, 210, 137, 36, 225, 173];
    },
    {
      name: 'createStrategyEvent';
      discriminator: [95, 184, 21, 242, 124, 223, 203, 226];
    },
    {
      name: 'depositEvent';
      discriminator: [120, 248, 61, 83, 31, 142, 107, 144];
    },
    {
      name: 'executeTradeEvent';
      discriminator: [233, 204, 87, 73, 205, 91, 43, 160];
    },
    {
      name: 'placeOrderEvent';
      discriminator: [65, 191, 25, 91, 27, 252, 192, 40];
    },
    {
      name: 'redeemEvent';
      discriminator: [90, 114, 83, 146, 212, 26, 217, 59];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'unauthorized';
      msg: 'unauthorized';
    },
    {
      code: 6001;
      name: 'invalidTimestamp';
      msg: 'Invalid timestamp';
    },
    {
      code: 6002;
      name: 'notMatured';
      msg: 'Yield token not matured yet';
    },
    {
      code: 6003;
      name: 'invalidOrderParameters';
      msg: 'Invalid order parameters';
    },
    {
      code: 6004;
      name: 'ordersCannotBeMatched';
      msg: 'Orders cannot be matched';
    },
    {
      code: 6005;
      name: 'orderNotCancellable';
      msg: 'Order not cancellable';
    },
    {
      code: 6006;
      name: 'insufficientLiquidity';
      msg: 'Insufficient liquidity';
    },
    {
      code: 6007;
      name: 'marketAlreadyExists';
      msg: 'Market already exists';
    },
  ];
  types: [
    {
      name: 'cancelOrderEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'market';
            type: 'pubkey';
          },
          {
            name: 'order';
            type: 'pubkey';
          },
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'timestamp';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'createMarketEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'market';
            type: 'pubkey';
          },
          {
            name: 'strategy';
            type: 'pubkey';
          },
          {
            name: 'yieldTokenMint';
            type: 'pubkey';
          },
          {
            name: 'baseTokenMint';
            type: 'pubkey';
          },
          {
            name: 'timestamp';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'createStrategyEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'strategy';
            type: 'pubkey';
          },
          {
            name: 'tokenAddress';
            type: 'pubkey';
          },
          {
            name: 'apy';
            type: 'u64';
          },
          {
            name: 'timestamp';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'depositEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'user';
            type: 'pubkey';
          },
          {
            name: 'strategy';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'maturityDate';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'depositState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'montant';
            type: 'u64';
          },
          {
            name: 'montantYield';
            type: 'u64';
          },
          {
            name: 'user';
            type: 'pubkey';
          },
          {
            name: 'strategyAddress';
            type: 'pubkey';
          },
          {
            name: 'date';
            type: 'i64';
          },
          {
            name: 'maturityDate';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'executeTradeEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'market';
            type: 'pubkey';
          },
          {
            name: 'buyer';
            type: 'pubkey';
          },
          {
            name: 'seller';
            type: 'pubkey';
          },
          {
            name: 'price';
            type: 'u64';
          },
          {
            name: 'quantity';
            type: 'u64';
          },
          {
            name: 'timestamp';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'market';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'strategyAddress';
            type: 'pubkey';
          },
          {
            name: 'yieldTokenMint';
            type: 'pubkey';
          },
          {
            name: 'baseTokenMint';
            type: 'pubkey';
          },
          {
            name: 'authority';
            type: 'pubkey';
          },
          {
            name: 'feeRate';
            type: 'u64';
          },
          {
            name: 'totalVolume';
            type: 'u64';
          },
          {
            name: 'createdAt';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'order';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'market';
            type: 'pubkey';
          },
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'orderType';
            type: {
              defined: {
                name: 'orderType';
              };
            };
          },
          {
            name: 'side';
            type: {
              defined: {
                name: 'orderSide';
              };
            };
          },
          {
            name: 'price';
            type: 'u64';
          },
          {
            name: 'quantity';
            type: 'u64';
          },
          {
            name: 'filledQuantity';
            type: 'u64';
          },
          {
            name: 'status';
            type: {
              defined: {
                name: 'orderStatus';
              };
            };
          },
          {
            name: 'createdAt';
            type: 'i64';
          },
          {
            name: 'expiresAt';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'orderSide';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'buy';
          },
          {
            name: 'sell';
          },
        ];
      };
    },
    {
      name: 'orderStatus';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'open';
          },
          {
            name: 'partiallyFilled';
          },
          {
            name: 'filled';
          },
          {
            name: 'cancelled';
          },
          {
            name: 'expired';
          },
        ];
      };
    },
    {
      name: 'orderType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'market';
          },
          {
            name: 'limit';
          },
        ];
      };
    },
    {
      name: 'placeOrderEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'market';
            type: 'pubkey';
          },
          {
            name: 'order';
            type: 'pubkey';
          },
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'side';
            type: 'string';
          },
          {
            name: 'price';
            type: 'u64';
          },
          {
            name: 'quantity';
            type: 'u64';
          },
          {
            name: 'timestamp';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'redeemEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'user';
            type: 'pubkey';
          },
          {
            name: 'strategy';
            type: 'pubkey';
          },
          {
            name: 'amountRedeemed';
            type: 'u64';
          },
          {
            name: 'penaltyApplied';
            type: 'bool';
          },
          {
            name: 'timestamp';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'strategy';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'tokenAddress';
            type: 'pubkey';
          },
          {
            name: 'tokenYieldAddress';
            type: 'pubkey';
          },
          {
            name: 'date';
            type: 'i64';
          },
          {
            name: 'rewardApy';
            type: 'u64';
          },
        ];
      };
    },
  ];
};
