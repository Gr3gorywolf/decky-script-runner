import {
    BashOriginal,
    LuaOriginal,
    NodejsOriginal,
    PerlOriginal,
    PhpOriginal,
    PythonOriginal,
    RubyOriginal,
} from "devicons-react";
import { ScriptData } from "../types/script-data";
interface ImageProps extends React.SVGProps<SVGElement> {
    size?: number | string;
    script: ScriptData
}

export const ImageByLanguage: React.FunctionComponent<ImageProps> = (props) => {
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
    const foundImage = languageImages[props.script.language] ?? languageImages.unknown;
    return foundImage;
};
