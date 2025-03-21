// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @author xzf0587 <zhaofengxu@microsoft.com>
 */
import "./teamsApp/create";
import "./teamsApp/validate";
import "./teamsApp/configure";
import "./teamsApp/copyAppPackageToSPFx";
import "./teamsApp/publishAppPackage";
import "./aad/create";
import "./aad/update";
import "./arm/deploy";
import "./botAadApp/create";
import "./deploy/azure/azureAppServiceDeployDriver";
import "./deploy/azure/azureFunctionDeployDriver";
import "./deploy/azure/azureStorageDeployDriver";
import "./deploy/azure/azureStorageStaticWebsiteConfigDriver";
import "./deploy/spfx/deployDriver";
import "./script/dotnetBuildDriver";
import "./script/npmBuildDriver";
import "./script/npxBuildDriver";
import "./script/scriptDriver";
import "./prerequisite/installDriver";
import "./file/createOrUpdateEnvironmentFile";
import "./file/createOrUpdateJsonFile";
import "./file/updateEnv";
import "./file/updateJson";
import "./botFramework/createOrUpdateBot";
import "./m365/acquire";
import "./add/addWebPart";
