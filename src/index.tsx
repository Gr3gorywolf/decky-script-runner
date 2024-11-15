import { PanelSection, PanelSectionRow, staticClasses, DialogButton, Focusable, Navigation } from "@decky/ui";
import { addEventListener, removeEventListener, definePlugin, toaster, call, routerHook } from "@decky/api";
import { useEffect, useState } from "react";
import { MdCode, MdSettings, MdSyncAlt, MdStorefront, MdInfo } from "react-icons/md";
import { ScriptData } from "./types/script-data";
import { ScriptCard } from "./components/ScriptCard";
import { SideloaderAlert } from "./components/SideloaderAlert";
import { SettingsPage } from "./components/Settings";
import { SettingsProvider } from "./contexts/SettingsContext";

function Content() {
    const [serverRunning, setServerRunning] = useState<boolean>(false);
    const [scripts, setScripts] = useState<ScriptData[]>([]);
    const [runningScripts, setRunningScripts] = useState<string[]>([]);
    const [deckIp, setDeckIp] = useState("");
    const fetchData = async () => {
        let isRunning = await call<[], boolean>("is_server_running");
        let scriptsData = await call<[], string>("get_scripts_data");
        let runningScripts = await call<[], string[]>("get_running_scripts");
        let deckIp = await call<[], string>("get_device_ip");
        setScripts(JSON.parse(scriptsData));
        setServerRunning(isRunning);
        setRunningScripts(runningScripts);
        setDeckIp(deckIp);
    };
    const handleGoToSettings = () => {
        Navigation.Navigate("/decky-script-runner/settings");
    };
    useEffect(() => {
        fetchData();
        const serverStatusListener = addEventListener("server_status_change", (status: boolean) => {
            if (status) {
                toaster.toast({ title: "Sideloading server Started", body: "Available on port 9696" });
            } else {
                toaster.toast({ title: "Sideloading server stopped", body: "Sideloading server has been stopped" });
            }
        });
        const interval = setInterval(fetchData, 1000);
        return () => {
            clearInterval(interval);
            removeEventListener("server_status_change", serverStatusListener);
        };
    }, []);

    const toggleServer = async () => {
        await call<[], void>("toggle_server");
    };
    const sideloadingUrl = `${deckIp}:9696`;
    return (
        <>
            <PanelSection>
                <div style={{ marginBottom: "-16px" }}>
                    {serverRunning && <SideloaderAlert deckIp={deckIp} sideloadingUrl={sideloadingUrl} />}
                    <PanelSectionRow>
                        <Focusable flow-children="horizontal" style={{ display: "flex", padding: 0, gap: "8px" }}>
                            <DialogButton
                                style={{
                                    minWidth: 0,
                                    width: "15%",
                                    height: "28px",
                                    backgroundColor: serverRunning ? "#1b5e20" : undefined,
                                    padding: "6px",
                                }}
                                onClick={toggleServer}
                            >
                                <MdSyncAlt />
                            </DialogButton>
                            <DialogButton
                                style={{ minWidth: 0, width: "15%", height: "28px", padding: "6px" }}
                                onClick={handleGoToSettings}
                            >
                                <MdSettings />
                            </DialogButton>
                            <DialogButton
                                style={{ minWidth: 0, width: "15%", height: "28px", padding: "6px" }}
                                onClick={() => {}}
                            >
                                <MdStorefront />
                            </DialogButton>
                            <DialogButton
                                style={{ minWidth: 0, width: "15%", height: "28px", padding: "6px" }}
                                onClick={() => {}}
                            >
                                <MdInfo />
                            </DialogButton>
                        </Focusable>
                    </PanelSectionRow>
                </div>
            </PanelSection>

            <PanelSection title="Scripts">
                {scripts.map((script) => (
                    <PanelSectionRow key={script.name}>
                        <ScriptCard isRunning={runningScripts.includes(script.name)} script={script} />
                    </PanelSectionRow>
                ))}
            </PanelSection>
        </>
    );
}

export default definePlugin(() => {
    console.log("Template plugin initializing, this is called once on frontend startup");

    routerHook.addRoute("/decky-script-runner/settings", SettingsPage, {
        exact: true,
    });
    return {
        // The name shown in various decky menus
        name: "Script runner",
        // The element displayed at the top of your plugin's menu
        titleView: <div className={staticClasses.Title}>Script runner</div>,
        // The content of your plugin's menu
        content: (
            <SettingsProvider>
                <Content />
            </SettingsProvider>
        ),
        icon: <MdCode />,
        onDismount() {
            console.log("Unloading");
            routerHook.removeRoute("/decky-script-runner/settings");
        },
    };
});
