import { TextField } from "@decky/ui";
import React, { FC, useState } from "react";
import { AlertModal } from "./AlertModal";

interface props {
    title: React.ReactNode;
    textTitle: string;
    initialValue?: string;
    onOk?: (text:string, close:()=>void) => void;
    closeModal?(): void;
}

export const TextAlertModal:FC<props> = ({title, closeModal, onOk, textTitle, initialValue}) =>{
    const [text, setText] = useState(initialValue?? '');
    return (
        <AlertModal
        closeModal={closeModal}
        title={title}
        content={
            <TextField
                label={textTitle}
                value={text}
                onChange={(e) => {
                    setText(e.target.value)
                    console.log(e.target.value);
                }}
            />
        }
        onOk={() => {
            if(onOk){
                setText((curText)=>{
                    onOk(curText, closeModal ?? (()=>{}));
                    return curText
                })
            }

        }}
        okayText="Continue"
    />
    )
}
