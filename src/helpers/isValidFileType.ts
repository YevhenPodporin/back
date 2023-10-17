import {VALID_FILE_TYPES_FOR_CHAT} from "../constants/constants";

const isValidFileType = (fileType:string) => {
   return  VALID_FILE_TYPES_FOR_CHAT.includes(fileType)
};

export default isValidFileType;