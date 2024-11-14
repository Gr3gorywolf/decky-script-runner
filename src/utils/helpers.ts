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
