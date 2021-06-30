import { BigNumber } from '@ethersproject/bignumber';
import { NetworkExtendsAttributes } from '../../models/Network';
import { TokenExtendsAttributes } from '../../models/Token';




interface BalanceAttributes extends TokenExtendsAttributes {
  balance: BigNumber;
}

export { NetworkExtendsAttributes, TokenExtendsAttributes, BalanceAttributes };
