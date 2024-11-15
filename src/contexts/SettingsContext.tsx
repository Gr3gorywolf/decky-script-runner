import { createContext, ReactNode, useEffect, useState } from "react";
import { Settings } from "../types/settings";
import { defaultSettings, getSettings, initializeSettings } from "../api/settingsApi";

// Define the type for the context value
interface SettingsContextType {
    settings: Settings;
}

// Create the context with an undefined default value
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Define a provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const fetchSettings = async () => {
        await initializeSettings();
        const settingRes = await getSettings();
        setSettings(settingRes);
    };
    useEffect(() => {
        fetchSettings();
    }, []);

    return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>;
};
