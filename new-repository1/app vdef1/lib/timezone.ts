import { zonedTimeToUtc } from "date-fns-tz";

export const CANARY_TZ = "Atlantic/Canary";

export function nowCanary(): Date {
  return zonedTimeToUtc(new Date(), CANARY_TZ);
}
