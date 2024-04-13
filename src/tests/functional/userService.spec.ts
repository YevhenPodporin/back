import { clearUserTable } from "../../prisma/clearDataBase";
import { requestApp, loginTestUser } from "../index";
import { prisma, seed } from "../../prisma/seeds/userSeed";
import unlinkFIleByName from "../../helpers/unlinkFIleByName";

describe("Testing user service", () => {
  let loggedUser: {
    message: string;
    accessToken: string;
  };
  beforeAll(async () => {
    await clearUserTable();
    await seed();
    loggedUser = await loginTestUser();
  });

  it("Login and get profile", async () => {
    const res = await requestApp
      .get("/api/user/profile")
      .auth(loggedUser.accessToken, { type: "bearer" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        email: "test1@gmail.com",
        id: expect.any(Number),
      }),
    );
    expect(
      prisma.users.findFirst({ where: { email: res.body.email } }),
    ).toBeTruthy();
  });

  it("Get profile without login", async () => {
    const res = await requestApp.get("/api/user/profile");

    expect(res.statusCode).toEqual(401);
  });

  it("Edit correct profile", async () => {
    const nameToChange = "changed_name";
    const res = await requestApp
      .post("/api/user/profile/edit")
      .auth(loggedUser.accessToken, { type: "bearer" })
      .attach("file", process.cwd() + "/src/tests/test-files/image1.jpg")
      .field("first_name", nameToChange);

    expect(res.statusCode).toEqual(200);
    expect(res.body.first_name).toEqual(nameToChange);

    const updatedUser = await prisma.profile.findFirst({
      where: { user_id: res.body.user_id },
    });

    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.file_path).toBeTruthy();

    if (updatedUser && updatedUser.file_path) {
      await unlinkFIleByName(updatedUser.file_path);
    } else {
      throw Error("File was not save in server");
    }
  });

  it("Edit incorrect profile", async () => {
    const nameToChange = "";
    const res = await requestApp
      .post("/api/user/profile/edit")
      .auth(loggedUser.accessToken, { type: "bearer" })
      .field("first_name", nameToChange);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      errors: [
        {
          label: "first_name",
          message: '"first_name" is not allowed to be empty',
        },
      ],
    });
  });

  afterAll(async () => await clearUserTable());
});
