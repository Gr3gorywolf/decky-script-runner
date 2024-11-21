import { GeneralSettings } from "./pages/GeneralSettings";
import { AboutPage } from "./pages/AboutPage";
import { Focusable, Tabs } from "@decky/ui";
import { FC, useEffect, useState } from "react";

interface props{
    initialTab?: string;
}

export const SettingsPage:FC<props> = ({initialTab}) => {
    const [currentTab, setCurrentTab] = useState<string>("general-settings");
    useEffect(()=>{
        setTimeout(() => {
            setCurrentTab(initialTab ?? "general-settings");
        }, 60);
    },[initialTab])
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
