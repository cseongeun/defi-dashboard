import { COMMON_ERROR_REASON } from './common/constants';

const isCommonErrReason = (e) => {
  return COMMON_ERROR_REASON.includes(e.reasons);
};

abstract class Scheduler {
  abstract name: string;
  abstract working: boolean;

  abstract init();
  abstract run();

  handleError(e) {
    if (!isCommonErrReason(e)) {
      throw new Error(e);
    }
  }
}

export default Scheduler;
