import type { Node } from "unist";
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
    slackPing: "slackPing";
    slackPingMarker: "slackPingMarker";
    slackPingId: "slackPingId";
    slackChannel: "slackChannel";
    slackChannelMarker: "slackChannelMarker";
    slackChannelId: "slackChannelId";
    slackChannelSeparator: "slackChannelSeparator";
    slackChannelName: "slackChannelName";
  }
}

declare module "mdast" {
  interface RootContentMap {
    slackPing: SlackPing;
    slackChannel: SlackChannel;
  }
}

export interface SlackPing extends Node {
  type: "slackPing";
  userId: string;
  data?: {
    id: string;
    expiration: string;
    user: string;
    displayName: string;
    pronouns: string;
    image: string;
  };
}

export interface SlackChannel extends Node {
  type: "slackChannel";
  channelId: string;
  name?: string;
}

declare module "mdast" {
  interface PhrasingContentMap {
    slackPing: SlackPing;
    slackChannel: SlackChannel;
  }
}
