import * as fs from "fs";

 const unlinkFIleByName = async (fileName:string) => {
   await fs.unlink(process.cwd() + '/src/storage/files/' + fileName,(e)=>{
       e && console.log(e)
   })
}
export default unlinkFIleByName;