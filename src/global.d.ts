export * from "micromark-util-types";

declare module "micromark-util-types" {
  interface TokenTypeMap {
    slackBold: "slackBold";
    slackBoldMarker: "slackBoldMarker";
    slackBoldText: "slackBoldText";
    slackLinkMarkerOpen: "slackLinkMarkerOpen";
    slackLinkMarkerClose: "slackLinkMarkerClose";
    slackLink: "slackLink";
    slackLinkMarker: "slackLinkMarker";
    slackLinkUrl: "slackLinkUrl";
    slackLinkSeparator: "slackLinkSeparator";
    slackLinkText: "slackLinkText";
  }
}
