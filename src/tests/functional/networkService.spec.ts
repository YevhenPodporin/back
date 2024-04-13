import { clearUserTable } from "../../prisma/clearDataBase";
import { requestApp, loginTestUser } from "../index";
import { verifyAccessToken } from "../../utils/jwt";
import { Profile } from "@prisma/client";
import { prisma, seed } from "../../prisma/seeds/userSeed";

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

  it("Check pagination", async () => {
    let res = await requestApp
      .get("/api/network/get_users")
      .auth(loggedUser.accessToken, { type: "bearer" })
      .query({ pagination: { take: 10 } });

    expect(res.statusCode).toEqual(200);
    expect(res.body.list).toHaveLength(10);

    res = await requestApp
      .get("/api/network/get_users")
      .auth(loggedUser.accessToken, { type: "bearer" })
      .query({ pagination: { take: 1 } });

    expect(res.statusCode).toEqual(200);
    expect(res.body.list).toHaveLength(1);
  });

  it("Get all users exclude logged user", async () => {
    const res = await requestApp
      .get("/api/network/get_users")
      .auth(loggedUser.accessToken, { type: "bearer" })
      .query({ pagination: { take: 20 } });
    const loggedUserPayload = await verifyAccessToken(loggedUser.accessToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.list).toHaveLength(19);
    expect(res.body.count).toEqual(19);

    const excludeLoggedUser = res.body.list.find(
      (item: Partial<Profile>) => item.user_id === loggedUserPayload.id,
    );

    expect(excludeLoggedUser).toBeFalsy();
  });

  it("Send request to friends", async () => {
    const resUsersList = await requestApp
      .get("/api/network/get_users")
      .auth(loggedUser.accessToken, { type: "bearer" })
      .query({ pagination: { take: 20 } });
    const loggedUserPayload = await verifyAccessToken(loggedUser.accessToken);

    expect(resUsersList.statusCode).toEqual(200);

    const responseSendRequest = await requestApp
      .post("/api/network/request")
      .auth(loggedUser.accessToken, { type: "bearer" })
      .send({
        status: "REQUEST",
        to_user_id: resUsersList.body.list[0].user_id,
      });

    expect(responseSendRequest.statusCode).toEqual(200);
    expect(responseSendRequest.body.message).toEqual(
      "Request was send successful",
    );

    const recordInTable = await prisma.friends.findFirst({
      where: {
        from_user_id: loggedUserPayload.id,
        to_user_id: resUsersList.body.list[0].user_id,
        status: "REQUEST",
      },
    });

    expect(recordInTable).toBeTruthy();
  });

  it("Send request and check validate", async () => {
    const responseSendRequest = await requestApp
      .post("/api/network/request")
      .auth(loggedUser.accessToken, { type: "bearer" })
      .send({
        status: "REQUEST",
      });

    expect(responseSendRequest.statusCode).toEqual(400);
    expect(responseSendRequest.body).toEqual({
      errors: [
        {
          label: "to_user_id",
          message: '"to_user_id" is required',
        },
      ],
    });
  })

  afterAll(async () => await clearUserTable());
});
