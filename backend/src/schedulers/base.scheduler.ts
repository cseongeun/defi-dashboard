abstract class BaseScheduler {
  abstract name: string
  abstract init();
  abstract run();
}

export default BaseScheduler