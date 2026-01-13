import { mergeTypeDefs } from "@graphql-tools/merge";

// Import type definitions

import rootTypeDefs from "./root.types";
import { userTypeDefs } from "./user";
import { sessionTypeDefs } from "./sessions";

// Combine all type definitions
export const typeDefs = mergeTypeDefs([
  rootTypeDefs,
  userTypeDefs,
  sessionTypeDefs,
]);
