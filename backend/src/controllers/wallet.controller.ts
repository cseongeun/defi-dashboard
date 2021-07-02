import { Router, Request, Response, NextFunction } from 'express';
import Controller from './controller';
import { WalletService } from '../service';

class WalletController extends Controller {
  public path = '/wallet';
  public router = Router();

  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('wallet controller');
    this.router.post(`${this.path}/`, this.getBalance);
  }

  private async getBalance(req: Request, res: Response, next: NextFunction) {
    const {
      chainId,
      contractAddress,
      walletAddress,
      withInfo,
    }: { chainId: number; contractAddress: string; walletAddress: string; withInfo: boolean } = req.body;
    return WalletService.getBalance(chainId, contractAddress, walletAddress, withInfo);
  }
}

export default new WalletController();
