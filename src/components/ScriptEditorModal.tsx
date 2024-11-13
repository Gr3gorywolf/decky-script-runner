import { FC, useEffect, useState } from "react";
import { ScriptData } from "../types/script-data";
import { ConfirmModal } from "@decky/ui";
import { call, toaster } from "@decky/api";
// import CodeEditor from '@uiw/react-textarea-code-editor';
import React from "react";

interface props {
  script: ScriptData;
  closeModal?: () => void;
}

export const ScriptEditorModal: FC<props> = ({ closeModal, script }) => {
  const [content,setContent] = useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fetchScriptContent = async () => {
    const content = await call<[string], string>("get_script_content", script.name);
    setContent(content);
  }

  const saveScriptContent = async () => {
    const saved =  await call<[string, string], boolean>("save_script_content", script.name, content);
    let saveMsg = saved ? "Script saved" : "Failed to save the script";
    toaster.toast({ title: saveMsg, body: "" });
  }

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


  return (
    <ConfirmModal closeModal={closeModal} onOK={saveScriptContent} strOKButtonText={"Save"}  strCancelButtonText="Close" bAlertDialog={true}  strTitle={<>Editing: {script.name}</>}>
      <div style={editorStyle} ref={containerRef}>
      {/* <CodeEditor
      value={content}
      language="js"
      placeholder="Please write some code here..."
      onChange={(evn) => setContent(evn.target.value)}
      padding={15}
      style={{
        backgroundColor: "#f5f5f5",
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}
    /> */}
      </div>
    </ConfirmModal>
  );
};
