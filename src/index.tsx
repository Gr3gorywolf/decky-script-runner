import {
    PanelSection,
    PanelSectionRow,
    staticClasses,
    DialogButton,
    Focusable,
    Navigation,
    showModal,
} from "@decky/ui";
import { addEventListener, removeEventListener, definePlugin, toaster, call, routerHook } from "@decky/api";
import { useEffect, useState } from "react";
import { MdCode, MdSettings, MdSyncAlt, MdAdd, MdQuestionMark, MdGroups } from "react-icons/md";
import { ScriptData } from "./types/script-data";
import { ScriptCard } from "./components/ScriptCard";
import { SideloaderAlert } from "./components/SideloaderAlert";
import { SettingsPage } from "./components/Settings";
import { SettingsProvider } from "./contexts/SettingsContext";
import { TextAlertModal } from "./components/TextAlertModal";
import { SUPPORTED_SCRIPT_FORMATS } from "./utils/constants";
import { generateScriptComment } from "./utils/scripts";
import { AlertModal } from "./components/AlertModal";
import { StorePage } from "./components/Store";

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

    const handleOpenHelp = () => {
        window.open(`steam://openurl/${"https://github.com/Gr3gorywolf/decky-script-runner/wiki/Guide"}`, "_blank");
    };

    const handleGoToStore = () =>{
        Navigation.Navigate("/decky-script-runner/store");
    }

    const handleAddNewScript = () => {
        showModal(
            <TextAlertModal
                onOk={async (result, close) => {
                    if (result && SUPPORTED_SCRIPT_FORMATS.some((format) => result.endsWith(format))) {
                        const created = await call<[string, string], boolean>(
                            "create_script",
                            result,
                            generateScriptComment(result, true)
                        );
                        if (!created) {
                            showModal(
                                <AlertModal
                                    title="Script already exists"
                                    okayText="Ok"
                                    onOk={handleAddNewScript}
                                    content={`Script with name ${result} already exists`}
                                />
                            );
                        }
                    } else {
                        showModal(
                            <AlertModal
                                title="Invalid file format"
                                okayText="Ok"
                                onOk={handleAddNewScript}
                                content={`File format must be one of ${SUPPORTED_SCRIPT_FORMATS.join(", ")}`}
                            />
                        );
                    }
                    close();
                }}
                title="Create a script"
                textTitle={`Supported file formats are ${SUPPORTED_SCRIPT_FORMATS.join(", ")}`}
            />
        );
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
                                onClick={handleGoToStore}
                            >
                                <MdGroups />
                            </DialogButton>
                            <DialogButton
                                style={{ minWidth: 0, width: "15%", height: "28px", padding: "6px" }}
                                onClick={handleGoToSettings}
                            >
                                <MdSettings />
                            </DialogButton>
                            <DialogButton
                                style={{ minWidth: 0, width: "15%", height: "28px", padding: "6px" }}
                                onClick={handleOpenHelp}
                            >
                                <MdQuestionMark />
                            </DialogButton>
                        </Focusable>
                    </PanelSectionRow>
                </div>
            </PanelSection>

            <PanelSection title="Scripts">
                <DialogButton
                    style={{
                        minWidth: 0,
                        height: "24px",
                        padding: "3px",
                        fontSize: "12px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                    }}
                    onClick={handleAddNewScript}
                >
                    <MdAdd /> Add new script
                </DialogButton>
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

    const SettingsPageAbout = () => <SettingsPage initialTab="about" />;
    routerHook.addRoute("/decky-script-runner/settings", SettingsPage, {
        exact: true,
    });
    routerHook.addRoute("/decky-script-runner/about", SettingsPageAbout, {
        exact: true,
    });

    routerHook.addRoute("/decky-script-runner/store", StorePage, {
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
            routerHook.removeRoute("/decky-script-runner/about");
            routerHook.removeRoute("/decky-script-runner/store");
        },
    };
});
