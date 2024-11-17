import { Focusable, SteamSpinner } from "@decky/ui";
import { useEffect, useState } from "react";
import { MdStorefront } from "react-icons/md";
import { ScriptData } from "../../types/script-data";
import { StoreScriptCard } from "./components/StoreScriptCard";
import { call, fetchNoCors, toaster } from "@decky/api";

export const StorePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [localScripts, setLocalScripts] = useState<ScriptData[]>([]);
    const [scripts, setScripts] = useState<ScriptData[]>([]);

    const fetchCommunityScripts = async () => {
        setIsLoading(true);
        const response = await fetchNoCors(
            "https://github.com/Gr3gorywolf/decky-script-runner-scripts/releases/latest/download/store-metadata.json"
        );
        const data = await response.json();
        setScripts(data);
        setIsLoading(false);
    };

    const fetchLocalScripts = async () => {
        let scriptsData = await call<[], string>("get_scripts_data");
        setLocalScripts(JSON.parse(scriptsData));
    };

    const getDownloadedScript = (storeScript: ScriptData) => {
        const scriptName = `[${storeScript.author}]${storeScript.name}`;
        return localScripts.find((script) => script.name === scriptName && script["is-downloaded"]);
    };

    const handleDownload = async (data: ScriptData) => {
        const response = await fetchNoCors(data["download-url"] ?? "");
        const content = await response.text();
        const scriptName = `[${data.author}]${data.name}`;
        const created = await call<[string, string], boolean>("install_script", scriptName, content);
        if (created) {
            toaster.toast({
                title: "Script installed!",
                body: `The script ${data.name} has been installed`,
            });
            fetchLocalScripts();
        }
    };

    const handleDelete = async (data: ScriptData) => {
        const scriptName = `[${data.author}]${data.name}`;
        const deleted = await call<[string], boolean>("uninstall_script", scriptName);
        if (deleted) {
            toaster.toast({
                title: "Script uninstalled!",
                body: `The script ${data.name} has been uninstalled installed`,
            });
            fetchLocalScripts();
        }
    };

    useEffect(() => {
        fetchCommunityScripts();
        fetchLocalScripts();
    }, []);

    return (
        <Focusable style={{ minWidth: "100%", minHeight: "100%" }}>
            <div
                style={{
                    marginTop: "40px",
                    height: "calc(100% - 40px)",
                }}
            >
                <div
                    style={{
                        padding: "16px",
                        width: "100%",
                        margin: "0 auto",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "12px",
                        }}
                    >
                        <MdStorefront size={24} color="#3B82F6" />
                        <h1
                            style={{
                                color: "#ffffff",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                margin: "0",
                            }}
                        >
                            Community Scripts
                        </h1>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            height: "2px",
                            background: "#3B82F6",
                            marginTop: "12px",
                            opacity: "0.5",
                        }}
                    />
                </div>
                {isLoading ? (
                    <SteamSpinner background="transparent">Loading plugins</SteamSpinner>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            paddingLeft: "16px",
                            paddingRight: "16px",
                        }}
                    >
                        {scripts.map((script, index) => (
                            <StoreScriptCard
                                foundScript={getDownloadedScript(script)}
                                onDelete={() => {
                                    handleDelete(script);
                                }}
                                onDownload={async () => {
                                   await handleDownload(script);
                                }}
                                key={index}
                                script={script}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Focusable>
    );
};
