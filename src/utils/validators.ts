export const validateFileName = (fileName:string) =>{
  const validExtensions = [".js", ".py", ".sh", ".lua", ".pl", ".php", ".rb"];
  return validExtensions.some(ext => fileName.endsWith(ext)) && !fileName.includes(' ');
}
