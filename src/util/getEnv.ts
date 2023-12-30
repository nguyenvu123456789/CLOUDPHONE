import get from "get-object-value";
import { getCurLang } from "@/util/i18nUtil";

const defaultEnv: any = {};

const getProcessEnv = (key: string) => get(process.env, [key], defaultEnv[key]);

export const getEnv = (key: string) => {
  let val;
  switch (key) {
    case "i18n":
      val = getCurLang();
      break;
    default:
      val = getProcessEnv(key);
      break;
  }
  return val;
};
