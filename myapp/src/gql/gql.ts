/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation GoogleLoginOrSignUp($input: GoogleLoginOrSignUpInput!) {\n    googleLoginOrSignUp(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n      user {\n        ...User_Fragment\n      }\n      authToken {\n        token\n        expiredAt\n      }\n    }\n  }\n": types.GoogleLoginOrSignUpDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n      authToken {\n        token\n        expiredAt\n      }\n      user {\n        ...User_Fragment\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  mutation SendOTP($input: SendOtpInput!) {\n    sendOtp(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n    }\n  }\n": types.SendOtpDocument,
    "\n  mutation VerifyOTP($input: VerifyOtpInput!) {\n    verifyOtp(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n      user {\n        ...User_Fragment\n      }\n      authToken {\n        token\n        expiredAt\n      }\n    }\n  }\n": types.VerifyOtpDocument,
    "\n  fragment Post_Fragment on Post {\n    id\n    title\n    files {\n      id\n      url\n      postId\n      contentType\n    }\n  }\n": types.Post_FragmentFragmentDoc,
    "\n  query Posts {\n    posts {\n      ...Post_Fragment\n    }\n  }\n": types.PostsDocument,
    "\n  query Hello {\n    hello\n  }\n": types.HelloDocument,
    "\n  fragment User_Fragment on User {\n    id\n    username\n    email\n    verified\n    phoneNumber\n    createdAt\n    updatedAt\n  }\n": types.User_FragmentFragmentDoc,
    "\n  query Me {\n    me {\n      ...User_Fragment\n    }\n  }\n": types.MeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GoogleLoginOrSignUp($input: GoogleLoginOrSignUpInput!) {\n    googleLoginOrSignUp(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n      user {\n        ...User_Fragment\n      }\n      authToken {\n        token\n        expiredAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation GoogleLoginOrSignUp($input: GoogleLoginOrSignUpInput!) {\n    googleLoginOrSignUp(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n      user {\n        ...User_Fragment\n      }\n      authToken {\n        token\n        expiredAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n      authToken {\n        token\n        expiredAt\n      }\n      user {\n        ...User_Fragment\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n      authToken {\n        token\n        expiredAt\n      }\n      user {\n        ...User_Fragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendOTP($input: SendOtpInput!) {\n    sendOtp(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SendOTP($input: SendOtpInput!) {\n    sendOtp(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyOTP($input: VerifyOtpInput!) {\n    verifyOtp(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n      user {\n        ...User_Fragment\n      }\n      authToken {\n        token\n        expiredAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyOTP($input: VerifyOtpInput!) {\n    verifyOtp(input: $input) {\n      ok\n      errors {\n        message\n        field\n      }\n      user {\n        ...User_Fragment\n      }\n      authToken {\n        token\n        expiredAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Post_Fragment on Post {\n    id\n    title\n    files {\n      id\n      url\n      postId\n      contentType\n    }\n  }\n"): (typeof documents)["\n  fragment Post_Fragment on Post {\n    id\n    title\n    files {\n      id\n      url\n      postId\n      contentType\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Posts {\n    posts {\n      ...Post_Fragment\n    }\n  }\n"): (typeof documents)["\n  query Posts {\n    posts {\n      ...Post_Fragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Hello {\n    hello\n  }\n"): (typeof documents)["\n  query Hello {\n    hello\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment User_Fragment on User {\n    id\n    username\n    email\n    verified\n    phoneNumber\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment User_Fragment on User {\n    id\n    username\n    email\n    verified\n    phoneNumber\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      ...User_Fragment\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      ...User_Fragment\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;