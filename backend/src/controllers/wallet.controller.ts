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
    this.router.post(`${this.path}/`, this.main);
  }

  private async main(req: Request, res: Response, next: NextFunction) {
    return res.json(true);
  }
}

export default new WalletController();
