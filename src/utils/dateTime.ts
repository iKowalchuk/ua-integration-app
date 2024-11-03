import { toZonedTime } from 'date-fns-tz';

export const TIME_ZONE = 'Europe/Kiev';

export const getCurrentKyivTime = () => toZonedTime(new Date(), TIME_ZONE);
