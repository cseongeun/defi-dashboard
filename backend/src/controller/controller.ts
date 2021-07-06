import { Router } from 'express';

abstract class Controller {
  path: string;
  router: Router;

  constructor() {}
}

export default Controller;
