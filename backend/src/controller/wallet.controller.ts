import { Router, Request, Response, NextFunction } from 'express';
import Controller from './controller';
import { WalletService, AddressService } from '../service';

class WalletController extends Controller {
  public path = '/wallet';
  public router = Router();

  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('wallet controller');
    this.router.get(`${this.path}/token/balances`, this.getWalletBalances);
  }

  private async getWalletBalances(req: Request, res: Response, next: NextFunction) {
    const { walletAddress } = req.params;
  }
}

export default new WalletController();
