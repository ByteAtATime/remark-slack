export * from "micromark-util-types";

declare module "micromark-util-types" {
  interface TokenTypeMap {
    slackBold: "slackBold";
    slackBoldMarker: "slackBoldMarker";
    slackBoldText: "slackBoldText";

    multipleSpaces: "multipleSpaces";
  }
}
