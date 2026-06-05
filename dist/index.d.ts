import { QuartzEmitterPlugin } from '@quartz-community/types';

interface Options {
    curatorId: string;
}
declare const SteamCuratorEmitter: QuartzEmitterPlugin<Options>;

export { SteamCuratorEmitter };
