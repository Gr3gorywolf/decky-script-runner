

export enum SettingKeys {
    launchLogsConsole = 'launchLogsConsole',
    showScriptName = 'showScriptName',
    enableLaunchFromSideloader = 'enableLaunchFromSideloader'
}
export interface Settings{
    launchLogsConsole: boolean;
    showScriptName: boolean;
    enableLaunchFromSideloader:boolean;
}
