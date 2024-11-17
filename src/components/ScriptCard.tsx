import { Focusable, DialogButton, showModal, showContextMenu, Menu, MenuItem } from "@decky/ui";
import { MdTerminal, MdPlayArrow, MdStop, MdMoreVert, MdDelete, MdEdit, MdCode, MdStorefront } from "react-icons/md";
import { ScriptData } from "../types/script-data";
import React, { FC } from "react";
import { call, toaster } from "@decky/api";
import { ScriptConsoleModal } from "./ScriptConsoleModal";
import { AlertModal } from "./AlertModal";
import { ScriptViewerModal } from "./ScriptViewerModal";
import { TextAlertModal } from "./TextAlertModal";
import { validateFileName } from "../utils/validators";
import { useSettings } from "../hooks/useSettings";
import { ImageByLanguage } from "./ImageByLanguage";


interface props {
    script: ScriptData;
    isRunning: boolean;
}

export const ScriptCard: FC<props> = ({ isRunning, script }) => {
    const containerStyle = {
        display: "flex",
        flexDirection: "row",
        padding: "5px",
        maxWidth: "320px",
        margin: "6px auto",
        borderBottom: "1px solid #262D35",
        fontSize: "6px",
    } as React.CSSProperties;

    const containerInfoStyle = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    } as React.CSSProperties;

    const imageStyle = {
        width: "40px",
        height: "40px",
        marginRight: "8px",
    };

    const contentStyle = {
        flex: 1,
    };

    const nameStyle = {
        fontSize: "10px",
        fontWeight: "bold",
        margin: "0 0 1px 0",
    };

    const authorStyle = {
        fontSize: "8px",
        color: "#666",
        margin: "0 0 2px 0",
    };

    const descriptionStyle = {
        fontSize: "6px",
        lineHeight: "1.2",
        margin: "0",
    };

    const buttonContainerStyle = {
        display: "flex",
        flexDirection: "row" as const,
        alignItems: "center",
        margin: "5px",
        marginLeft: "auto",
        gap: "4px",
    };

    const buttonStyle = {
        minWidth: 0,
        padding: "6px",
        width: "28px",
        height: "28px",
        maxWidth: "23px !important",
    };

    const settings = useSettings();


    const handleToggleRunningScript = async (rootPasswd?: string) => {
        if (!rootPasswd && script.root && !isRunning) {
            showModal(
                <TextAlertModal
                    textTitle="This script requires root permissions to run, Take care!"
                    title="Root password required"
                    onOk={(passwd) => {
                        handleToggleRunningScript(passwd);
                    }}
                />
            );
            return;
        }
        await call<[string, string?], void>("toggle_script_running", script.name, rootPasswd);
        if (!isRunning && settings.launchLogsConsole) {
            showConsoleModal();
        }
    };

    const handleDeleteScript = async () => {
        showModal(
            <AlertModal
                title="Delete script"
                content="Are you sure you want to delete this script?"
                onOk={() => {
                    call<[string], void>("delete_script", script.name);
                }}
                okayText="Continue"
            />
        );
    };

    const handleRenameScript = async () => {
        showModal(
            <TextAlertModal
                textTitle="New script name"
                title="Rename script"
                initialValue={script.name}
                onOk={(newName) => {
                    if (validateFileName(newName)) {
                        call<[string, string], void>("rename_script", script.name, newName);
                    } else {
                        toaster.toast({ title: "Invalid filename", body: "Unsopported language or whitespace found" });
                    }
                }}
            />
        );
    };

    const handleOpenEditor = () => {
        showModal(<ScriptViewerModal script={script} />);
    };

    const showScriptContextMenu = () => {
        showContextMenu(
            <Menu cancelText="Close" label="Script actions">
                <MenuItem onClick={() => handleDeleteScript()}>
                    <MdDelete /> {!script["is-downloaded"]? 'Delete' :'Uninstall'}{" "}
                </MenuItem>
               {!script["is-downloaded"] && <MenuItem onClick={() => handleRenameScript()}>
                    <MdEdit /> Rename{" "}
                </MenuItem>}
                <MenuItem onClick={() => showConsoleModal()}>
                    <MdTerminal /> View logs
                </MenuItem>
                <MenuItem onClick={() => handleOpenEditor()}>
                    <MdCode /> View source
                </MenuItem>
            </Menu>
        );
    };

    const showConsoleModal = () => {
        showModal(<ScriptConsoleModal isRunning={isRunning} script={script} />);
    };

    return (
        <div style={containerStyle}>
            <div style={containerInfoStyle}>
                <ImageByLanguage script={script} size={40} style={imageStyle} />
                <div style={contentStyle}>
                    <h2 style={nameStyle}>{settings.showScriptName ? script.name : script.title}</h2>
                    {script.description && <p style={descriptionStyle}>{script.description}</p>}
                    {(script.author || script.version || script.root) && (
                        <p style={authorStyle}>
                             {
                                script["is-downloaded"] && <span style={{color:"#4caf50"}}>[<MdStorefront/>]</span>
                            }
                            {script.root && (
                                <span
                                    style={{
                                        color: "#b71c1c",
                                    }}
                                >
                                    [ROOT]
                                </span>
                            )}
                            {"  "}v{script.version} by {script.author}
                        </p>
                    )}
                </div>
            </div>

            <Focusable flow-children="horizontal" style={buttonContainerStyle}>
                <DialogButton focusable style={buttonStyle} onClick={() => handleToggleRunningScript()}>
                    {isRunning ? <MdStop /> : <MdPlayArrow />}
                </DialogButton>

                {isRunning && (
                    <DialogButton style={buttonStyle} onClick={showConsoleModal}>
                        <MdTerminal />
                    </DialogButton>
                )}
                <DialogButton style={buttonStyle} onClick={showScriptContextMenu}>
                    <MdMoreVert />
                </DialogButton>
            </Focusable>
        </div>
    );
};
