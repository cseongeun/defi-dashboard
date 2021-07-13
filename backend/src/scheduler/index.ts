import { default as TokenPriceScheduler } from './tokenPrice.scheduler';
import { default as PancakeSwapScheduler } from './pancakeSwap.scheduler';
import { default as SushiSwapScheduler } from './sushiSwap.scheduler';

export const SchedulerInstances = [TokenPriceScheduler, PancakeSwapScheduler, SushiSwapScheduler];
