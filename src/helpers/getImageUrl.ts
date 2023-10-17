 export const getImageUrl = (file_path: string | null | undefined) => {
    if(file_path){
        return (process.env.BACKEND_IMAGE_URL || 'http://localhost:4000/image/') + file_path
    }else{
        return null
    }
}