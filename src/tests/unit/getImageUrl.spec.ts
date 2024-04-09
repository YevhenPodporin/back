import {getImageUrl} from "../../helpers/getImageUrl";

describe('Test getImageUrl', () => {
    const filePath = 'public/image/test-image.jpg'
    const domainPath = process.env.BACKEND_IMAGE_URL || 'http://localhost:4000/image/'

    it('get correct image url', () => {
        const imageUrl = getImageUrl(filePath)

        expect(imageUrl).toEqual(domainPath + filePath)
    })

    it('get empty image url', () => {
        const imageUrl = getImageUrl('')

        expect(imageUrl).toEqual(null)
    })
})