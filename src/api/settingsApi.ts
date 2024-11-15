import { call } from "@decky/api";
import { SettingKeys, Settings } from "../types/settings"


export const defaultSettings: Settings = {
  launchLogsConsole: true,
  showScriptName: false,
  enableLaunchFromSideloader: false
}


export async function initializeSettings() {
    await call<[Settings], Settings>("init_settings",defaultSettings);

}

export async function getSettings() {
  return await  call<[], Settings>("get_settings");
}



export async function setSetting<T>(settingKey: SettingKeys, value: T) {
  return call<[string, T], Settings>("set_setting", settingKey, value);
}
