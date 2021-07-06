abstract class Scheduler {
  abstract name: string;
  abstract init();
  abstract run();
}

export default Scheduler;
