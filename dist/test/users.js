"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chai_1 = require("chai");
const chai_http_1 = __importDefault(require("chai-http"));
const User = require('../../src/models/user');
describe('Users API', () => {
    let app;
    before(async () => {
        const chai = await Promise.resolve().then(() => __importStar(require("chai")));
        const appModule = await Promise.resolve().then(() => __importStar(require('../index')));
        app = appModule.default;
        (0, chai_1.use)(chai_http_1.default);
        await mongoose_1.default.connect('mongodb://localhost:27017/LLtestdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    });
    after(async () => {
        await mongoose_1.default.connection.close();
    });
    describe('GET /me', () => {
        it('should return user information if authenticated', async () => {
            const user = new User({
                fullName: 'Test User',
                email: 'test@example.com',
                password: 'kebean123'
            });
            await user.save();
            const res = await chai.request(app)
                .get('/me')
                .set('x-auth-token', user.generateAuthToken());
            (0, chai_1.expect)(res).to.have.status(200);
            (0, chai_1.expect)(res.body).to.have.property('_id');
            (0, chai_1.expect)(res.body).to.have.property('fullName');
            (0, chai_1.expect)(res.body).to.have.property('email').equal('test@example.com');
            (0, chai_1.expect)(res.body).to.not.have.property('password');
            (0, chai_1.expect)(res.body).to.not.have.property('confirmPassword');
        });
    });
    describe('POST /', () => {
        it('should create a new user if input is valid', async () => {
            const user = {
                fullName: 'New User',
                email: 'newuser@example.com',
                password: 'kebean123',
                confirmPassword: 'kebean123'
            };
            const res = await chai.request(app)
                .post('/')
                .send(user);
            (0, chai_1.expect)(res).to.have.status(200);
            (0, chai_1.expect)(res.body).to.have.property('_id');
            (0, chai_1.expect)(res.body).to.have.property('fullName').equal('New User');
            (0, chai_1.expect)(res.body).to.have.property('email').equal('newuser@example.com');
        });
    });
});
//# sourceMappingURL=users.js.map