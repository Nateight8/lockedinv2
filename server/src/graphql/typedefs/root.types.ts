import { gql } from "graphql-tag";

export const rootTypeDefs = gql`
  type Query {
    me: User
  }

  type Mutation {
    # Auth is handled via REST but we could add auth mutations here
    _empty: String
  }
`;

export default rootTypeDefs;
