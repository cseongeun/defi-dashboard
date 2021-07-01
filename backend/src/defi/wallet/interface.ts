import { BigNumber } from '@ethersproject/bignumber';
import { NetworkExtendsAttributes } from '../../models/Network';
import { TokenExtendsAttributes } from '../../models/Token';

interface BalanceAttributes {
  balance: BigNumber;
}

interface BalanceExtendsAttributes extends BalanceAttributes, TokenExtendsAttributes {}

export { NetworkExtendsAttributes, TokenExtendsAttributes, BalanceAttributes, BalanceExtendsAttributes };
