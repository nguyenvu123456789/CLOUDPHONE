import get from "get-object-value";
import { getCurLang } from "@/util/i18nUtil";
import {  DEFAULT_ENV } from "@/conf/const";

const getProcessEnv = (key: string) => {
  let val = get(process.env, [key], DEFAULT_ENV[key]) as string;
  const valLowerCase = val?.toLowerCase();
  switch (valLowerCase) {
    case "true":
    case "false":
    case "null":
      val = JSON.parse(valLowerCase);
      break;
  }
  return val;
};

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
