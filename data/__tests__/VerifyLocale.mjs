//@ts-check

/**
 *  @typedef {import("mocha")}
 */
import { globSync } from "glob";
import { expect } from "chai";
import { Validator } from "jsonschema";
import { readYamlSync, readJSONSync, handleError } from "./UnitTool.mjs";

describe("Test lang list", () => {
  const data = readYamlSync("data/locale/lang.yaml");
  const schema = readJSONSync("data/schema_lang.json");
  it(`test dimensions.json`, () => {
    const v = new Validator();
    const result = v.validate(data, schema);
    expect(result.valid, handleError(result.errors)).to.be.true;
  });
});

describe("Test lang data", () => {
  const allLangData = globSync("data/locale/**/data.yaml");
  const schema = readJSONSync("data/schema_locale_data.json");
  allLangData.forEach((f) => {
    it(`test ${f}`, () => {
      const data = readYamlSync(f);
      const v = new Validator();
      const result = v.validate(data, schema);
      expect(result.valid, handleError(result.errors)).to.be.true;
    });
  });
});
