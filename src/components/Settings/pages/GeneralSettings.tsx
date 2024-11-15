import { Field, Focusable, Toggle } from "@decky/ui";
import { useEffect, useState } from "react";
import { defaultSettings, getSettings, setSetting } from "../../../api/settingsApi";
import { SettingKeys } from "../../../types/settings";

export const GeneralSettings = () => {
    const [settings, setSettings] = useState(defaultSettings);
    const fetchSettings = async () => {
        const settingRes = await getSettings();
        setSettings(settingRes);
    };

    const handleUpdateSettings = (key: SettingKeys, value: any) => {
        setSettings({ ...settings, [key]: value });
        setSetting(key, value);
    };
    useEffect(() => {
        fetchSettings();
    }, []);
    return (
        <Focusable>
            <Field
                label="Launch logs console when starting script"
                description="When launching a script it will automatically open the debug log console"
            >
                <Toggle
                    value={settings.launchLogsConsole}
                    onChange={(deckyUpdates) => {
                        handleUpdateSettings(SettingKeys.launchLogsConsole, deckyUpdates);
                    }}
                />
            </Field>
            <Field
                label="Show script name instead of title"
                description="Show the script name on the script list instead of the script title"
            >
                <Toggle
                    value={settings.showScriptName}
                    onChange={(deckyUpdates) => {
                        handleUpdateSettings(SettingKeys.showScriptName, deckyUpdates);
                    }}
                />
            </Field>
            <Field
                label="Enable launch from sideloader"
                description="Enables remote script execution from the sideloader server (Need to reload the sideloader app)"
            >
                <Toggle
                    value={settings.enableLaunchFromSideloader}
                    onChange={(deckyUpdates) => {
                        handleUpdateSettings(SettingKeys.enableLaunchFromSideloader, deckyUpdates);
                    }}
                />
            </Field>
        </Focusable>
    );
};
