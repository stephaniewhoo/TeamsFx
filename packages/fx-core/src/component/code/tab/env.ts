// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

import * as dotenv from "dotenv";
import fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import { isKvPairEqual } from "../../utils/common";
import { LogProvider } from "@microsoft/teamsfx-api";
import { LogMessages } from "../../messages";

export interface RemoteEnvs {
  teamsfxRemoteEnvs: { [key: string]: string };
  customizedRemoteEnvs: { [name: string]: string };
}

export const envFileNamePrefix = `.env.teamsfx.`;
export const envFileName = (envName: string): string => envFileNamePrefix + envName;
export const envFilePath = (envName: string, folder: string): string =>
  path.join(folder, envFileName(envName));

export const EnvKeys = Object.freeze({
  FuncEndpoint: "REACT_APP_FUNC_ENDPOINT",
  FuncName: "REACT_APP_FUNC_NAME",
  RuntimeEndpoint: "REACT_APP_TEAMSFX_ENDPOINT",
  StartLoginPage: "REACT_APP_START_LOGIN_PAGE_URL",
  ClientID: "REACT_APP_CLIENT_ID",
});

export const getEmptyEnvs = (): RemoteEnvs => {
  return {
    teamsfxRemoteEnvs: {},
    customizedRemoteEnvs: {},
  };
};

export async function loadEnvFile(envPath: string, logger?: LogProvider): Promise<RemoteEnvs> {
  try {
    return await _loadEnvFile(envPath);
  } catch (e: any) {
    logger?.error(e.toString());
    logger?.error(LogMessages.FailedLoadEnv(envPath));
  }
  return getEmptyEnvs();
}

async function _loadEnvFile(envPath: string): Promise<RemoteEnvs> {
  const result = getEmptyEnvs();
  if (!(await fs.pathExists(envPath))) {
    return result;
  }

  const envs = dotenv.parse(await fs.readFile(envPath));
  const entries = Object.entries(envs);
  for (const [key, value] of entries) {
    if (Object.values(EnvKeys).includes(key)) {
      result.teamsfxRemoteEnvs[key] = value;
    } else {
      result.customizedRemoteEnvs[key] = value;
    }
  }
  return result;
}

export async function saveEnvFile(
  envPath: string,
  envs: RemoteEnvs,
  logger?: LogProvider
): Promise<void> {
  const configs = await loadEnvFile(envPath);
  try {
    return await _saveEnvFile(envPath, envs, configs);
  } catch (e: any) {
    logger?.error(e.toString());
    logger?.error(LogMessages.FailedSaveEnv(envPath));
  }
}

async function _saveEnvFile(envPath: string, envs: RemoteEnvs, configs: RemoteEnvs): Promise<void> {
  const newConfigs: RemoteEnvs = {
    teamsfxRemoteEnvs: { ...configs.teamsfxRemoteEnvs, ...envs.teamsfxRemoteEnvs },
    customizedRemoteEnvs: { ...configs.customizedRemoteEnvs, ...envs.customizedRemoteEnvs },
  };

  if (
    isKvPairEqual(newConfigs.teamsfxRemoteEnvs, configs.teamsfxRemoteEnvs) &&
    isKvPairEqual(newConfigs.customizedRemoteEnvs, configs.customizedRemoteEnvs) &&
    (await fs.pathExists(envPath))
  ) {
    // Avoid updating dotenv file's modified time if path already exists and nothing changes.
    // We decide whether to skip deployment by comparing the mtime of all project files and last deployment time.
    return;
  }

  await fs.ensureFile(envPath);

  const envString =
    `# Following variables are generated by TeamsFx${os.EOL}` +
    concatEnvString(newConfigs.teamsfxRemoteEnvs) +
    `${os.EOL}# Following variables can be customized or you can add your owns${os.EOL}` +
    `# FOO=BAR${os.EOL}` +
    concatEnvString(newConfigs.customizedRemoteEnvs);

  await fs.writeFile(envPath, envString);
}

function concatEnvString(envs: { [key: string]: string }): string {
  return (
    Object.entries(envs)
      .map(([k, v]) => `${k}=${v}`)
      .join(os.EOL) + os.EOL
  );
}
