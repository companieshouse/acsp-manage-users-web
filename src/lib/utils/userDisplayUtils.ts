import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../../lib/constants";

export const getDisplayNameOrEmail = (member: AcspMembership): string => !member.userDisplayName || member.userDisplayName === constants.NOT_PROVIDED ? member.userEmail : member.userDisplayName;

export const getDisplayNameOrLangKeyForNotProvided = (member: AcspMembership): string => member.userDisplayName === constants.NOT_PROVIDED ? constants.LANG_KEY_FOR_NOT_PROVIDED : member.userDisplayName;
