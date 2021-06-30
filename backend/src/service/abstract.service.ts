abstract class Service {
  abstract create(params: any, transaction: any): Promise<any>;
  abstract findAll(where: any, transaction: any): Promise<any>;
  abstract findOne(where: any, transaction: any): Promise<any>;
}

export default Service;
