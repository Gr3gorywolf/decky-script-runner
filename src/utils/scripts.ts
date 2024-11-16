import { humanizeFileName } from "./helpers";

export function generateScriptComment(scriptName: string, isCreating = false) {
  const language = scriptName.slice(scriptName.lastIndexOf('.') + 1).toLowerCase();
  const content = `
----------metadata---------
title: ${humanizeFileName(scriptName)}
description:
image:
author: Unknown
version: 0.0.0
root: false
----------metadata---------
`;
  const comments = {
    sh: isCreating ? `#!/bin/bash\n: '${content}'` : `: '${content}'`,
    pl: `=pod${content}=cut`,
    py: `"""${content}"""`,
    js: `/*${content}*/`,
    rb: `=begin${content}=end`,
    lua: `--[[${content}]]--`,
    php: isCreating ? `<?php\n/*${content}*/\n?>` : `/*${content}*/`
  };
  // @ts-ignore
  return comments[language] ?? '';
}
