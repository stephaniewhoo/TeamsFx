// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Constants } from "./constants";
import { getDefaultString, getLocalizedString } from "../../../common/localizeUtils";

export class AppStudioError {
  public static readonly FileNotFoundError = {
    name: "FileNotFoundError",
    message: (filePath: string): [string, string] => [
      getDefaultString("error.appstudio.fileNotFoundError", filePath),
      getLocalizedString("error.appstudio.fileNotFoundError", filePath),
    ],
  };

  public static readonly DeveloperPortalAPIFailedError = {
    name: "DeveloperPortalAPIFailed",
    message: (
      e: any,
      correlationId: string,
      requestPath: string,
      apiName: string,
      extraData: string
    ): [string, string] => [
      getDefaultString(
        "error.appstudio.apiFailed.telemetry",
        e.name,
        e.message,
        apiName,
        correlationId,
        extraData
      ),
      getLocalizedString(
        "error.appstudio.apiFailed",
        e.name,
        e.message,
        requestPath,
        correlationId,
        extraData
      ),
    ],
  };

  public static readonly AuthServiceAPIFailedError = {
    name: "AuthServiceAPIFailed",
    message: (e: any, requestPath: string, apiName: string): [string, string] => [
      getDefaultString("error.appstudio.authServiceApiFailed", e.name, e.message, apiName),
      getLocalizedString("error.appstudio.authServiceApiFailed", e.name, e.message, requestPath),
    ],
  };

  public static readonly InvalidParameterError = {
    name: "InvalidParamError",
    message: (actionName: string, params: string[]): [string, string] => [
      getDefaultString("driver.teamsApp.invalidParameter", actionName, params),
      getLocalizedString("driver.teamsApp.invalidParameter", actionName, params),
    ],
  };

  public static readonly TeamsAppCreateFailedError = {
    name: "TeamsAppCreateFailed",
    message: (error?: any): [string, string] => [
      getDefaultString("error.appstudio.teamsAppCreateFailed", error?.message),
      getLocalizedString("error.appstudio.teamsAppCreateFailed", error?.displayMessage),
    ],
  };

  public static readonly TeamsAppUpdateFailedError = {
    name: "TeamsAppUpdateFailed",
    message: (teamsAppId: string): [string, string] => [
      getDefaultString("error.appstudio.teamsAppUpdateFailed", teamsAppId),
      getLocalizedString("error.appstudio.teamsAppUpdateFailed", teamsAppId),
    ],
  };

  public static readonly InvalidTeamsAppIdError = {
    name: "InvalidTeamsAppId",
    message: (teamsAppId: string): [string, string] => [
      getDefaultString("error.teamsApp.InvalidAppIdError", teamsAppId),
      getLocalizedString("error.teamsApp.InvalidAppIdError", teamsAppId),
    ],
  };

  public static readonly TeamsAppNotExistsError = {
    name: "TeasmAppNotExists",
    message: (teamsAppId: string): [string, string] => [
      getDefaultString("error.teamsApp.AppIdNotExistError", teamsAppId),
      getLocalizedString("error.teamsApp.AppIdNotExistError", teamsAppId),
    ],
  };

  public static readonly ValidationFailedError = {
    name: "ManifestValidationFailed",
    message: (errors: string[]): [string, string] => [
      getDefaultString("plugins.appstudio.validationFailedNotice") + " " + errors.join("\n"),
      getLocalizedString("plugins.appstudio.validationFailedNotice") + " " + errors.join("\n"),
    ],
  };

  public static readonly GetLocalDebugConfigFailedError = {
    name: "GetLocalDebugConfigFailed",
    message: (error: any): [string, string] => [
      getDefaultString("error.appstudio.getLocalConfigFailed", error.message),
      getLocalizedString("error.appstudio.getLocalConfigFailed", error.message),
    ],
  };

  public static readonly GetRemoteConfigFailedError = {
    name: "GetRemoteConfigFailed",
    message: (errorMessage: string, isProvisionSucceeded: boolean): [string, string] => [
      getDefaultString("error.appstudio.getRemoteConfigFailed", errorMessage) +
        `${isProvisionSucceeded ? "" : getDefaultString("plugins.appstudio.provisionTip")}`,
      getLocalizedString("error.appstudio.getRemoteConfigFailed", errorMessage) +
        `${isProvisionSucceeded ? "" : getLocalizedString("plugins.appstudio.provisionTip")}`,
    ],
  };

  public static readonly TeamsAppPublishFailedError = {
    name: "TeamsAppPublishFailed",
    message: (
      teamsAppId: string,
      requestPath: string,
      correlationId?: string
    ): [string, string] => [
      getDefaultString("error.appstudio.publishFailed", teamsAppId) +
        `Request path: ${requestPath}` +
        (correlationId ? `X-Correlation-ID: ${correlationId}` : ""),
      getLocalizedString("error.appstudio.publishFailed", teamsAppId) +
        `Request path: ${requestPath}` +
        (correlationId ? `X-Correlation-ID: ${correlationId}` : ""),
    ],
  };

  public static readonly TeamsPackageBuildError = {
    name: "TeamsPackageBuildError",
    message: (error: any): [string, string] => [
      error.message ?? getDefaultString("error.appstudio.buildError"),
      error.displayMessage ?? getLocalizedString("error.appstudio.buildError"),
    ],
  };

  public static readonly CheckPermissionFailedError = {
    name: "CheckPermissionFailed",
    message: (error: any): [string, string] => [
      getDefaultString("error.appstudio.checkPermissionFailed", error.message),
      getLocalizedString("error.appstudio.checkPermissionFailed", error.message),
    ],
  };

  public static readonly GrantPermissionFailedError = {
    name: "GrantPermissionFailed",
    message: (errorMessage: string, id?: string): [string, string] => [
      `${Constants.PERMISSIONS.name}: ${id}. ` +
        getDefaultString("error.appstudio.grantPermissionFailed", errorMessage),
      `${Constants.PERMISSIONS.name}: ${id}. ` +
        getLocalizedString("error.appstudio.grantPermissionFailed", errorMessage),
    ],
  };

  public static readonly ListCollaboratorFailedError = {
    name: "ListCollaboratorFailedError",
    message: (error: any): [string, string] => [
      getDefaultString("error.appstudio.listCollaboratorFailed", error.message),
      getLocalizedString("error.appstudio.listCollaboratorFailed", error.message),
    ],
  };

  public static readonly UpdateManifestWithInvalidAppError = {
    name: "UpdateManifestWithInvalidAppError",
    message: (appId: string): [string, string] => [
      getDefaultString("error.appstudio.updateManifestInvalidApp", appId),
      getLocalizedString("error.appstudio.updateManifestInvalidApp", appId),
    ],
  };

  public static readonly InvalidCapabilityError = {
    name: "InvalidCapabilityError",
    message: (capability: string): [string, string] => [
      getDefaultString("error.appstudio.invalidCapability", capability),
      getLocalizedString("error.appstudio.invalidCapability", capability),
    ],
  };

  public static readonly CapabilityExceedLimitError = {
    name: "CapabilityExceedLimitError",
    message: (capability: string): [string, string] => [
      getDefaultString("error.appstudio.capabilityExceedLimit", capability),
      getLocalizedString("error.appstudio.capabilityExceedLimit", capability),
    ],
  };

  public static readonly StaticTabNotExistError = {
    name: "StaticTabNotExist",
    message: (index: string): [string, string] => [
      getDefaultString("error.appstudio.staticTabNotExist", index),
      getLocalizedString("error.appstudio.staticTabNotExist", index),
    ],
  };

  public static readonly CapabilityNotExistError = {
    name: "CapabilityNotExist",
    message: (capability: string): [string, string] => [
      getDefaultString("error.appstudio.capabilityNotExist", capability),
      getLocalizedString("error.appstudio.capabilityNotExist", capability),
    ],
  };

  public static readonly TeamsAppCreateConflictError = {
    name: "TeamsAppCreateConflict",
    message: (): [string, string] => [
      getDefaultString("error.appstudio.teamsAppCreateConflict"),
      getLocalizedString("error.appstudio.teamsAppCreateConflict"),
    ],
  };

  public static readonly TeamsAppCreateConflictWithPublishedAppError = {
    name: "TeamsAppCreateConflictWithPublishedApp",
    message: (): [string, string] => [
      getDefaultString("error.appstudio.teamsAppCreateConflictWithPublishedApp"),
      getLocalizedString("error.appstudio.teamsAppCreateConflictWithPublishedApp"),
    ],
  };
}
