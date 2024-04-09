import unlinkFileByName from "../../helpers/unlinkFIleByName";
import * as fs from "fs";

describe('Test unlinkFileByName', () => {
    let testFileName = `${Date.now()}-test-file.txt`;
    let testFilePath = process.cwd() + `\\src\\storage\\files\\${testFileName}`;

    beforeAll(() => {
        fs.writeFileSync(testFilePath, 'Test');
    })

    it('check unlink existing file', async () => {
        let isExistsTestFile = fs.existsSync(testFilePath);

        expect(isExistsTestFile).toBe<boolean>(true);

        await unlinkFileByName(testFileName);

        isExistsTestFile = fs.existsSync(testFilePath);

        expect(isExistsTestFile).toBe(false);
    })

    it('check unlink not existing file', async () => {
        try {
            await unlinkFileByName(testFileName);
        } catch (error) {
            expect(error).toBe(testFilePath); // Проверяем, что ошибка совпадает с ожидаемой ошибкой
        }
    })

    it('check if filepath empty', async () => {
        const res=  await unlinkFileByName('');

        expect(res).toBeUndefined();
    })

    afterEach(() => jest.clearAllMocks())
})