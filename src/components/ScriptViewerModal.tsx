import { FC, useEffect, useState } from "react";
import { ScriptData } from "../types/script-data";
import { ConfirmModal } from "@decky/ui";
import { call } from "@decky/api";
import React from "react";
import { CodeBlock, vs2015 } from "react-code-blocks";
import { getFileExtension } from "../utils/helpers";
import { MdSyncAlt } from "react-icons/md";

interface props {
    script: ScriptData;
    closeModal?: () => void;
}

export const ScriptViewerModal: FC<props> = ({ closeModal, script }) => {
    const [content, setContent] = useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);
    const fetchScriptContent = async () => {
        const content = await call<[string], string>("get_script_content", script.name);
        setContent(content);
    };

    useEffect(() => {
        fetchScriptContent();
    }, []);

    const editorStyle = {
        padding: "5px",
        borderRadius: "5px",
        maxWidth: "600px",
        width: "100%",
        overflow: "auto",
        minHeight: "240px",
        maxHeight: "240px",
    };

    const noteStyle = {
        fontSize: "10px",
        marginLeft:"5px",
        marginBottom: "3px",
    };

    const languagesByExtension = {
        ".sh": "bash",
        ".lua": "lua",
        ".js": "javascript",
        ".pl": "perl",
        ".php": "php",
        ".py": "python",
        ".rb": "ruby",
    };

    const extension = getFileExtension(script.name);
    let language = undefined;
    if (extension) {
        // @ts-ignore
        language = languagesByExtension[extension] ?? undefined;
    }

    return (
        <ConfirmModal
            closeModal={closeModal}
            onCancel={closeModal}
            strCancelButtonText="Close"
            bAlertDialog={true}
            strTitle={<>Viewing: {script.name}</>}
        >
            <span style={noteStyle}>
                Note: in order to edit this script we encourage you to use the built in sideloader (<MdSyncAlt />) that provides a code editor
            </span>
            <div style={editorStyle} ref={containerRef}>
                <CodeBlock text={content} language={language} showLineNumbers={true} theme={vs2015} />
            </div>
        </ConfirmModal>
    );
};
