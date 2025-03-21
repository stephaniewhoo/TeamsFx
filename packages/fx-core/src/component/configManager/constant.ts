export enum SummaryConstant {
  Succeeded = "(√) Done:",
  Failed = "(×) Error:",
  NotExecuted = "(!) Warning:",
}

export const component = "ConfigManager";

export const lifecycleExecutionEvent = "lifecycle-execution";

export enum TelemetryProperty {
  Lifecycle = "lifecycle",
  Actions = "actions",
  ResolvedPlaceholders = "resolved",
  UnresolvedPlaceholders = "unresolved",
  FailedAction = "failed-action",
}
