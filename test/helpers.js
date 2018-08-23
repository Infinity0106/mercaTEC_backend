const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const server = require("../bin/www");
const should = chai.should();
const expect = chai.expect();
chai.use(chaiHttp);

global.faker = faker;
global.chai = chai;
global.server = server;
global.should = should;
global.expect = expect;
