import { FC, useEffect, useState } from "react";
import { ScriptData } from "../types/script-data";
import { humanizeFileName } from "../utils/helpers";
import { ConfirmModal } from "@decky/ui";
import { call } from "@decky/api";
import React from "react";

interface props {
  script: ScriptData;
  closeModal?: () => void;
}

export const ScriptConsoleModal: FC<props> = ({ closeModal, script }) => {
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fetchConsoleOutput = async () => {
    let scriptLogs = await call<[string], string>("get_script_logs", script.name);
    setConsoleOutput(scriptLogs.split("\n"));
   
  }

  const autoScroll = () =>{
    const container = containerRef.current;
    if(!container) return;
    const offset = 2.0;
    const reverseScrollHeight = Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight);
    const isOnBottom = reverseScrollHeight <= offset;
    if(isOnBottom ) {
      setTimeout(() => {
        container.scrollTop = 10000000;
      }, 15);
    }
  }

  useEffect(() => {
    const interval = setInterval(fetchConsoleOutput, 1000);
    const autoScrollInterval = setInterval(autoScroll, 200);
    return () => {
      clearInterval(interval);
      clearInterval(autoScrollInterval);
    };
  }, []);

  const consoleStyle = {
    color: "#ffffff",
    fontFamily: "monospace",
    padding: "5px",
    borderRadius: "5px",
    maxWidth: "600px",
    width: "100%",
    overflow: "auto",
    minHeight: "240px",
    maxHeight: "240px",
  };

  const lineStyle = {
    margin: "0",
    padding: "2px 0",
    display: "flex",
  };

  const promptStyle = {
    color: "#00ff00",
    marginRight: "8px",
  };

  const infoStyle = {
    color: 'white',
  };

  return (
    <ConfirmModal closeModal={closeModal} bAlertDialog={true}  strTitle={<>Running: {humanizeFileName(script.name)}</>}>
      <div style={consoleStyle} ref={containerRef}>
        {consoleOutput.map((line, index) => (
          <div key={index} style={lineStyle}>
            <span style={promptStyle}>{`[${script.name}]:`}</span>
            <span style={infoStyle}>{line}</span>
          </div>
        ))}
      </div>
    </ConfirmModal>
  );
};
