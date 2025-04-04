import { DEFAULT_PASSWORD, MONGODB_URI, NO_USERS_TO_CREATE, EMAIL_DOMAIN } from "./config.js";
import { faker } from "@faker-js/faker";
import { MongoClient } from "mongodb";

async function main () {
    const client = new MongoClient(MONGODB_URI, { directConnection: true });

    try {
        await client.connect();
        await listDatabases(client);

        // create data for users
        const users = createUserData(NO_USERS_TO_CREATE);
        // create a single ACSP
        const acsp = createAcspData(1);
        // create member data for the users and the above newly created ACSP
        const acspMembers = createAcspMemberData(acsp[0], users);

        await addUserDataToMongo(client, users);
        await addAcspDataToMongo(client, acsp);
        await addAcspMemberDataToMongo(client, acspMembers);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function listDatabases (client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

async function addUserDataToMongo (client, newUsers) {
    const result = await client
        .db("account")
        .collection("users")
        .insertMany(newUsers);

    console.log(
        `${result.insertedCount} new users(s) created with the following ids:`
    );
    console.log(result.insertedIds);
}

async function addAcspDataToMongo (client, acsp) {
    const result = await client
        .db("acsp_profile")
        .collection("acsp_profile")
        .insertMany(acsp);

    console.log(
        `${result.insertedCount} new acsp(s) created with the following ids:`
    );
    console.log(result.insertedIds);
}

async function addAcspMemberDataToMongo (client, acspMembers) {
    const result = await client
        .db("acsp_members")
        .collection("acsp_members")
        .insertMany(acspMembers);

    console.log(
        `${result.insertedCount} new acsp members created with the following ids:`
    );
    console.log(result.insertedIds);
}

function createUserData (count) {
    const persons = [];
    for (let i = 0; i < count; i += 1) {
        const forename = faker.person.firstName();
        const surname = faker.person.lastName();
        const displayNameOptions = [null, `${forename} ${surname}`];
        persons.push({
            _id: faker.string.uuid().replace(/-/g, ""),
            email: faker.internet.email({ firstName: `inugami_test_data_${forename}`, lastName: surname, provider: EMAIL_DOMAIN }).toLowerCase(),
            password: DEFAULT_PASSWORD,
            display_name: displayNameOptions[Math.floor(Math.random() * 2)]
        });
    }
    return persons;
}

function createAcspData (count) {
    const acsps = [];
    for (let i = 0; i < count; i += 1) {
        const companyName = faker.company.name();
        const acspNumber = `TSA${faker.string.numeric(3)}`;
        acsps.push({
            _id: acspNumber,
            data: {
                acsp_number: acspNumber,
                name: companyName,
                status: "active",
                type: "limited-company",
                links: {
                    self: `/authorised-corporate-service-provider/${acspNumber}`
                }
            }
        });
    }
    return acsps;
}

function createAcspMemberData (acsp, users) {
    const roles = ["admin", "owner", "standard"];
    return users.map((user) => ({
        _id: faker.string.uuid().replace(/-/g, ""),
        acsp_number: acsp._id,
        user_id: user._id,
        user_role: roles[Math.floor(Math.random() * 3)],
        created_at: new Date("2023-07-03T11:55:23.649668000"),
        added_at: new Date("2023-07-03T11:55:23.649668000"),
        added_by: null,
        removed_at: null,
        removed_by: null,
        status: "active",
        etag: "b035bfdb99170913f11f73ac0d0e8afb9f15c13f",
        version: 0,
        _class: "uk.gov.companieshouse.acsp.manage.users.model.AcspMembersDao"
    }));
}

main().catch(console.error);
