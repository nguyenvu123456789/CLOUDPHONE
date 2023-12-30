//@ts-check

import fs from "fs";
import YAML from "yaml";

export const readYamlSync = (/**@type string*/ finalPath) => {
  let fileContent;
  if (fs.existsSync(finalPath)) {
    fileContent = fs.readFileSync(finalPath, "utf8");
    try {
      return YAML.parse(fileContent);
    } catch (e) {
      const err = /**@type Error*/ e;
      console.warn(err.message);
    }
  } else {
    console.warn(`[${finalPath}] not exists.`);
  }
};

export const readJSONSync = (/**@type string*/ file) => {
  const content = fs.readFileSync(file, "utf-8");
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    const err = /**@type Error*/ e;
    console.warn(`Parse JSON file failed ${file}`, err.message);
    console.log(err.stack);
  }
  return data;
};


/**
 * @param {any} errors
 */
export const handleError = (errors) => {
  return `\n${errors
    .map(
      /**
       * @param {any} e
       */
      (e) => {
        if (e.name === "oneOf") {
          let str = e.stack;
          e.argument.forEach(
            /**
             * @param {any} s
             * @param {any} i
             */
            (s, i) => {
              str = str.replace(s, JSON.stringify(e.schema[e.name][i]));
            }
          );
          return str;
        } else {
          return e.stack;
        }
      }
    )
    .join("\n")}\n`;
};
