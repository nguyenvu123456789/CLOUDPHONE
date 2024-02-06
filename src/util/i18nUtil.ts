import get from "get-object-value";
import fs from "fs";
import YAML from "yaml";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { cookies, headers } from "next/headers";
import { CLANG, DATA_ROOT } from "@/conf/const";
import tpl from "tpl-string";
import { countryToLang } from "@/util/CountryToLangISOCodeMap";

const matchCache = Object.create(null);
const yamlCache = Object.create(null);

const _readYaml = (path: string) => {
  const finalPath = `${DATA_ROOT}/locale/${path}`;
  let fileContent;
  if (fs.existsSync(finalPath)) {
    fileContent = fs.readFileSync(finalPath, "utf8");
    try {
      return YAML.parse(fileContent);
    } catch (e) {
      const err = e as Error;
      console.warn(err.message);
    }
  } else {
    console.warn(`[${finalPath}] not exists.`);
  }
};

const readYaml = (path: string) => {
  if (null == yamlCache[path]) {
    yamlCache[path] = _readYaml(path);
  }
  return yamlCache[path];
};

class I18NUtil {

  isStaticSite() {
    return "export" === process?.env?.output;
  }

  getLocaleData() {
    const localeData = readYaml("lang.yaml");
    return localeData;
  }

  getOneIntlLang(langKey: string) {
    const localeData = this.getLocaleData();
    if (localeData[langKey] && langKey !== "en") {
      return readYaml(`${langKey}/data.yaml`);
    }
  }

  getLocales() {
    const locales = this.getLocaleData();
    return locales ? Object.keys(locales) : [];
  }

  getAcceptLanguage() {
    if (this.isStaticSite()) {
      return null;
    }
    const headersList = headers();
    const languages = new Negotiator({
      headers: { "accept-language": headersList.get("accept-language") || "" },
    }).languages();
    return this.getLocale(languages);
  }

  getLocale = (languages: string[]) => {
    const key = languages.sort().join(",");
    if ("" !== key) {
      if (null == matchCache[key]) {
        matchCache[key] = this._getMatchLocale(key);
      }
      return matchCache[key];
    }
  };

  _getMatchLocale = (sLanguages: string) => {
    const languages = sLanguages.split(",");
    const locales = this.getLocales();
    const defaultLocale = "en-US";
    const finalLang = match(languages, locales, defaultLocale);
    return finalLang;
  };

  getCurLang = (): string|undefined => {
    if (this.isStaticSite()) {
      return;
    }
    const cookieStore = cookies();
    let curLang: any = cookieStore.get(CLANG)?.value;
    if (!curLang) {
      curLang = this.getAcceptLanguage();
    } else {
      curLang = this.getLocale(countryToLang(curLang));
    }
    return curLang;
  };

  getDirection = () => {
    const curLang = this.getCurLang();
    if (null != curLang) {
      return get(new Intl.Locale(curLang).maximize(), [
        "textInfo",
        "direction",
      ]);
    }
  };

  getTranslate() {
    const curLang = this.getCurLang();
    if (curLang) {
      return this.getOneIntlLang(curLang);
    }
  }

  _ = (key: string, payload?: any) => {
    const alang = this.getTranslate();
    let result = get(alang, [key], key);
    if (null != payload) {
      result = tpl(result, payload);
    }
    return result;
  };
}

const i18n = new I18NUtil();

export const getCurLang = i18n.getCurLang;
export const getCurLangDirection = i18n.getDirection;
export const _ = i18n._;
