import { Focusable, DialogButton, showModal } from "@decky/ui";
import { MdTerminal, MdPlayArrow, MdStop, MdDelete } from "react-icons/md";
import { ScriptData } from "../types/script-data";
import React, { FC } from "react";
import { humanizeFileName } from "../utils/helpers";
import { call } from "@decky/api";
import { ScriptConsoleModal } from "./ScriptConsoleModal";
import { BashOriginal, LuaOriginal, NodejsOriginal, PerlOriginal, PhpOriginal, PythonOriginal, RubyOriginal } from "devicons-react";

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
    borderBottom:"1px solid #262D35",
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

  const ImageByLanguage:React.FunctionComponent<ImageProps> = (props) => {
    const languageImages = {
      py: <PythonOriginal {...props}/>,
      sh: <BashOriginal {...props}/>,
      js: <NodejsOriginal {...props}/>,
      lua:<LuaOriginal {...props}/>,
      pl:<PerlOriginal {...props}/>,
      php:<PhpOriginal {...props}/>,
      rb:<RubyOriginal {...props}/>,
      unknown: <BashOriginal {...props}/>,
    };
    //@ts-ignore
    const foundImage = languageImages[script.language] ?? languageImages.unknown;
    return foundImage;
  };

  const handleToggleRunningScript = async () => {
    await call<[string], void>("toggle_script_running", script.name);
  };

  const showDetailsModal = () => {
    showModal(<ScriptConsoleModal script={script} />);
  };

  return (
    <div style={containerStyle}>
      <div style={containerInfoStyle}>
        <ImageByLanguage size={40} style={imageStyle}  />
        <div style={contentStyle}>
          <h2 style={nameStyle}>{humanizeFileName(script.name)}</h2>
          {script.author && <p style={authorStyle}>{script.author}</p>}
          {script.description && <p style={descriptionStyle}>{script.description}</p>}
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
        <DialogButton style={buttonStyle} onClick={() => {}}>
          <MdDelete />
        </DialogButton>
      </Focusable>
    </div>
  );
};
