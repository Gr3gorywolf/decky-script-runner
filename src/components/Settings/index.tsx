import { GeneralSettings } from "./pages/GeneralSettings";
import { AboutPage } from "./pages/AboutPage";
import { Focusable, Tabs } from "@decky/ui";
import { useState } from "react";

export const SettingsPage = () => {
    const [currentTab, setCurrentTab] = useState<string>("general-settings");
    const tabs = [
        {
            title: "General settings",
            id: "general-settings",
            content: <GeneralSettings />,
        },
        {
            title: "About",
            id: "about",
            content: <AboutPage />,
        },
    ];
    return (
        <Focusable style={{ minWidth: "100%", minHeight: "100%" }}>
            <div style={{ marginTop: "40px", height: "calc(100% - 40px)" }}>
                <Tabs
                    activeTab={currentTab}
                    onShowTab={(tab: string) => {
                        setCurrentTab(tab);
                    }}
                    tabs={tabs}
                />
            </div>
        </Focusable>
    );
    return <Tabs />;
};
