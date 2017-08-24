// @flow

import graphqlHTTP from "express-graphql";
import Root from "./root";
import Schema from "./schema";

export default graphqlHTTP({
  schema: Schema,
  rootValue: Root,
  graphiql: true
});
