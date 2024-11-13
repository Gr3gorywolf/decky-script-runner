import { Focusable, DialogButton, showModal, showContextMenu, Menu, MenuItem, TextField } from "@decky/ui";
import { MdTerminal, MdPlayArrow, MdStop, MdMoreVert, MdDelete, MdEdit, MdCode } from "react-icons/md";
import { ScriptData } from "../types/script-data";
import React, { FC, useState } from "react";
import { call, toaster } from "@decky/api";
import { ScriptConsoleModal } from "./ScriptConsoleModal";
import {
    BashOriginal,
    LuaOriginal,
    NodejsOriginal,
    PerlOriginal,
    PhpOriginal,
    PythonOriginal,
    RubyOriginal,
} from "devicons-react";
import { AlertModal } from "./AlertModal";
import { validateFileName } from "../utils/validators";
import { ScriptEditorModal } from "./ScriptEditorModal";

interface ImageProps extends React.SVGProps<SVGElement> {
    size?: number | string;
}

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
    const [newScriptName, setNewScriptName] = useState("");

    const ImageByLanguage: React.FunctionComponent<ImageProps> = (props) => {
        const languageImages = {
            py: <PythonOriginal {...props} />,
            sh: <BashOriginal {...props} />,
            js: <NodejsOriginal {...props} />,
            lua: <LuaOriginal {...props} />,
            pl: <PerlOriginal {...props} />,
            php: <PhpOriginal {...props} />,
            rb: <RubyOriginal {...props} />,
            unknown: <BashOriginal {...props} />,
        };
        //@ts-ignore
        const foundImage = languageImages[script.language] ?? languageImages.unknown;
        return foundImage;
    };

    const handleToggleRunningScript = async () => {
        await call<[string], void>("toggle_script_running", script.name);
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
            <AlertModal
                title="Rename script"
                content={
                    <TextField
                        label={"New script name"}
                        value={script.name}
                        onChange={(e) => setNewScriptName(e.target.value)}
                    />
                }
                onOk={() => {
                    setNewScriptName((curFileName)=>{
                        if(validateFileName(curFileName)){
                            call<[string, string], void>("rename_script", script.name, newScriptName);
                            return script.name
                        }else{
                            toaster.toast({ title: "Invalid filename", body: "Unsopported language or whitespace found" });
                        }
                        return newScriptName
                    })

                }}
                okayText="Continue"
            />
        );
    };


    const handleOpenEditor = () =>{
        showModal(<ScriptEditorModal script={script} />);
    }

    const showScriptContextMenu = () => {
        showContextMenu(
            <Menu cancelText="Close" label="Script actions">
                <MenuItem onClick={() => handleDeleteScript()}>
                    <MdDelete /> Delete{" "}
                </MenuItem>
                <MenuItem onClick={()=> handleRenameScript()}>
                    <MdEdit /> Rename{" "}
                </MenuItem>
                <MenuItem onClick={()=>handleOpenEditor()}>
                    <MdCode /> View source
                </MenuItem>
            </Menu>
        );
    };

    const showDetailsModal = () => {
        showModal(<ScriptConsoleModal script={script} />);
    };

    return (
        <div style={containerStyle}>
            <div style={containerInfoStyle}>
                <ImageByLanguage size={40} style={imageStyle} />
                <div style={contentStyle}>
                    <h2 style={nameStyle}>{script.title}</h2>
                    {script.description && <p style={descriptionStyle}>{script.description}</p>}
                    {script.author ||
                        (script.version && (
                            <p style={authorStyle}>
                                v{script.version} by {script.author}
                            </p>
                        ))}
                </div>
            </div>

            <Focusable flow-children="horizontal" style={buttonContainerStyle}>
                <DialogButton focusable style={buttonStyle} onClick={handleToggleRunningScript}>
                    {isRunning ? <MdStop /> : <MdPlayArrow />}
                </DialogButton>

                {isRunning && (
                    <DialogButton style={buttonStyle} onClick={showDetailsModal}>
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
