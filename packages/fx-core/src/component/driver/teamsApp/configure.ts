// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FxError, Result, err, ok, Platform } from "@microsoft/teamsfx-api";
import fs from "fs-extra";
import { hooks } from "@feathersjs/hooks/lib";
import isUUID from "validator/lib/isUUID";
import { merge } from "lodash";
import { StepDriver, ExecutionResult } from "../interface/stepDriver";
import { DriverContext } from "../interface/commonArgs";
import { WrapDriverContext } from "../util/wrapUtil";
import { ConfigureTeamsAppArgs } from "./interfaces/ConfigureTeamsAppArgs";
import { addStartAndEndTelemetry } from "../middleware/addStartAndEndTelemetry";
import { AppStudioClient } from "../../resource/appManifest/appStudioClient";
import { AppStudioResultFactory } from "../../resource/appManifest/results";
import { TelemetryUtils } from "../../resource/appManifest/utils/telemetry";
import { manifestUtils } from "../../resource/appManifest/utils/ManifestUtils";
import { AppStudioError } from "../../resource/appManifest/errors";
import { AppStudioScopes } from "../../../common/tools";
import { getLocalizedString } from "../../../common/localizeUtils";
import { TelemetryProperty } from "../../../common/telemetry";
import { Service } from "typedi";
import { getAbsolutePath } from "../../utils/common";
import { FileNotFoundError, InvalidActionInputError } from "../../../error/common";

export const actionName = "teamsApp/update";

export const outputNames = {
  TEAMS_APP_ID: "TEAMS_APP_ID",
  TEAMS_APP_TENANT_ID: "TEAMS_APP_TENANT_ID",
  TEAMS_APP_UPDATE_TIME: "TEAMS_APP_UPDATE_TIME",
};

@Service(actionName)
export class ConfigureTeamsAppDriver implements StepDriver {
  description = getLocalizedString("driver.teamsApp.description.updateDriver");

  public async run(
    args: ConfigureTeamsAppArgs,
    context: DriverContext
  ): Promise<Result<Map<string, string>, FxError>> {
    const wrapContext = new WrapDriverContext(context, actionName, actionName);
    const res = await this.update(args, wrapContext);
    return res;
  }

  public async execute(
    args: ConfigureTeamsAppArgs,
    context: DriverContext
  ): Promise<ExecutionResult> {
    const wrapContext = new WrapDriverContext(context, actionName, actionName);
    const res = await this.update(args, wrapContext);
    return {
      result: res,
      summaries: wrapContext.summaries,
    };
  }

  @hooks([addStartAndEndTelemetry(actionName, actionName)])
  async update(
    args: ConfigureTeamsAppArgs,
    context: WrapDriverContext
  ): Promise<Result<Map<string, string>, FxError>> {
    TelemetryUtils.init(context);

    const result = this.validateArgs(args);
    if (result.isErr()) {
      return err(result.error);
    }

    const appStudioTokenRes = await context.m365TokenProvider.getAccessToken({
      scopes: AppStudioScopes,
    });
    if (appStudioTokenRes.isErr()) {
      return err(appStudioTokenRes.error);
    }
    const appStudioToken = appStudioTokenRes.value;
    const appPackagePath = getAbsolutePath(args.appPackagePath, context.projectPath);
    if (!(await fs.pathExists(appPackagePath))) {
      return err(
        new FileNotFoundError(
          actionName,
          appPackagePath,
          "https://aka.ms/teamsfx-actions/teamsapp-update"
        )
      );
    }
    const archivedFile = await fs.readFile(appPackagePath);

    // Add capabilities to telemetry properties
    const manifest = manifestUtils.extractManifestFromArchivedFile(archivedFile);
    if (manifest.isErr()) {
      return err(manifest.error);
    }
    const capabilities = manifestUtils._getCapabilities(manifest.value).map((x) => {
      if (x == "staticTab" || x == "configurableTab") {
        return "Tab";
      } else {
        return x;
      }
    });
    merge(context.telemetryProperties, {
      [TelemetryProperty.Capabilities]: [...new Set(capabilities)].join(";"),
    });

    // Fail if Teams app not exists, as this action only update the Teams app, not create
    // See work item 17187087
    const teamsAppId = manifest.value.id;
    if (!isUUID(teamsAppId)) {
      return err(
        AppStudioResultFactory.UserError(
          AppStudioError.InvalidTeamsAppIdError.name,
          AppStudioError.InvalidTeamsAppIdError.message(teamsAppId),
          "https://aka.ms/teamsfx-actions/teamsapp-update"
        )
      );
    }
    try {
      await AppStudioClient.getApp(teamsAppId, appStudioToken, context.logProvider);
    } catch (error) {
      return err(
        AppStudioResultFactory.UserError(
          AppStudioError.TeamsAppNotExistsError.name,
          AppStudioError.TeamsAppNotExistsError.message(teamsAppId),
          "https://aka.ms/teamsfx-actions/teamsapp-update"
        )
      );
    }

    const progressHandler = context.ui?.createProgressBar(
      getLocalizedString("driver.teamsApp.progressBar.updateTeamsAppTitle"),
      1
    );
    await progressHandler?.start();

    try {
      let message = getLocalizedString("driver.teamsApp.progressBar.updateTeamsAppStepMessage");
      await progressHandler?.next(message);

      const appDefinition = await AppStudioClient.importApp(
        archivedFile,
        appStudioToken,
        context.logProvider,
        true
      );
      message = getLocalizedString(
        "plugins.appstudio.teamsAppUpdatedLog",
        appDefinition.teamsAppId!
      );
      context.logProvider.info(message);
      context.addSummary(message);
      if (context.platform === Platform.VSCode) {
        context.ui?.showMessage("info", message, false);
      }
      return ok(
        new Map([
          [outputNames.TEAMS_APP_ID, appDefinition.teamsAppId!],
          [outputNames.TEAMS_APP_TENANT_ID, appDefinition.tenantId!],
          [outputNames.TEAMS_APP_UPDATE_TIME, appDefinition.updatedAt!],
        ])
      );
    } catch (e: any) {
      await progressHandler?.end(false);
      return err(
        AppStudioResultFactory.SystemError(
          AppStudioError.TeamsAppUpdateFailedError.name,
          AppStudioError.TeamsAppUpdateFailedError.message(teamsAppId),
          "https://aka.ms/teamsfx-actions/teamsapp-update"
        )
      );
    } finally {
      await progressHandler?.end(true);
    }
  }

  private validateArgs(args: ConfigureTeamsAppArgs): Result<any, FxError> {
    const invalidParams: string[] = [];
    if (!args || !args.appPackagePath) {
      invalidParams.push("appPackagePath");
    }
    if (invalidParams.length > 0) {
      return err(
        new InvalidActionInputError(
          actionName,
          invalidParams,
          "https://aka.ms/teamsfx-actions/teamsapp-update"
        )
      );
    } else {
      return ok(undefined);
    }
  }
}
