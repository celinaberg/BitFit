// @flow

import { buildSchema } from "graphql";
import fs from "fs";
import path from "path";

export default buildSchema(
  fs.readFileSync(path.join(__dirname, "schema.graphql")).toString("utf8")
);
