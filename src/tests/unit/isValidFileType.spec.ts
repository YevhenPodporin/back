import isValidFileType from "../../helpers/isValidFileType";

describe('Test isValidFileType', () => {
    it('get correct file type', () => {
        const res = isValidFileType('jpeg')

        expect(res).toEqual(true)
    })

    it('get incorrect file type', () => {
        const res = isValidFileType('mp4')

        expect(res).toEqual(false)
    })
})