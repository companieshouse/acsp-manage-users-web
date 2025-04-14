
# acsp-manage-users-web

This is a web frontend for the ACSP Manage Users journey. It was created based on [Typescript Web Starter for Companies House](https://github.com/companieshouse/node-review-web-starter-ts).

## Frontend Technologies and Utils

- [NodeJS](https://nodejs.org/)
- [ExpressJS](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [NunJucks](https://mozilla.github.io/nunjucks)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [Jest](https://jestjs.io)
- [SuperTest](https://www.npmjs.com/package/supertest)
- [Sonarqube](https://www.sonarqube.org)
- [Docker](https://www.docker.com/)
- [Tilt](https://tilt.dev/)
- [Git](https://git-scm.com/downloads)
- [express-async-errors](https://www.npmjs.com/package/express-async-errors)
- [Helmet](https://helmetjs.github.io/)


## Running locally outside of Docker

This front end application can be run locally (using node and npm) along with the CHS development environnment.
Instructions can be found [here](https://companieshouse.atlassian.net/wiki/spaces/IDV/pages/4832100406/Running+a+Single+Web+Service+Outside+of+Docker)

### Test data

Instructions for adding initial data for development and testing, can be found [here](https://companieshouse.atlassian.net/wiki/spaces/IDV/pages/4517724334/Inugami+Test+Data)

In addition to the above there is a seed script is included, [with guidance and configuration options here](./tools/seed-acsp-data-mongo/README.md).r

### Helmet

We have used the npm package Helmet to setup security-related HTTP response headers.

### GOV.UK Frontend Design System

The repo uses GOV.UK Frontend v5.4.0. Version v5.0+ updates the design of the Tag component.
Text within the tag is no longer bold and uppercase with extra letter spacing. The colours have also changed to make them more distinguishable from buttons.

### Handling errors and promise rejections

Express-async-errors package 

 The Express-async-errors package has been added. This means when an error is thrown in an async function or a rejected promise is awaited inside an async function, any errors will be passed to the error handler as if calling next(err). [More information can be found here](./docs/Handling%20errors.md).

### Navigation Checks

To avoid users from skipping pages some navigation check logic has been implemented, which uses the
the referrer in the headers. Link to the middleware [here](https://github.com/companieshouse/acsp-manage-users-web/blob/main/src/middleware/navigationMiddleware.ts)






