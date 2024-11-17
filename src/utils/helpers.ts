export const humanizeFileName = (fileName: string) => {
   const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
   const withSpaces = nameWithoutExtension.replace(/[_-]/g, " ");
   const spacedCamelCase = withSpaces.replace(/([a-z])([A-Z])/g, "$1 $2");
   const humanized = spacedCamelCase.replace(/\b\w/g, char => char.toUpperCase());
   return humanized;
}


export const getFileExtension = (fileName:string, returnDots = true) =>{
  const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  return returnDots ? fileExtension : fileExtension.slice(1);
}


export const getFullLanguageName = (language: string) => {
  switch (language) {
    case "js":
      return "JavaScript";
    case "sh":
      return "Bash";
    case "py":
      return "Python";
    case "lua":
      return "Lua";
    case "pl":
      return "Perl";
    case "rb":
      return "Ruby";
    default:
      return language;
  }
}
