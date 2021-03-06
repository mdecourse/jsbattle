"use strict";

const serviceConfig = require('../../../app/lib/serviceConfig.js');
const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const { MoleculerClientError } = require("moleculer").Errors;

const createTestToken = (user) => ({
	id: (user ? user.id : '') || "123456",
	username: (user ? user.username : '') || "amy",
	role: (user ? user.role : '') || "user",
})
describe("Test 'Challenge' service", () => {

	describe("unregistered user", () => {
		let broker;
		beforeEach(async () => {
			serviceConfig.extend({ auth: { admins: [{provider: 'google', username: 'monica83' }] } });
			broker = new ServiceBroker({ logger: false });
			broker.createService({
					name: 'userStore',
					actions: {
						get: () => ({
							registered: false
						})
					}
			})
			const schemaBuilder = require(__dirname + "../../../../app/services/challenges/index.js");
			broker.createService(schemaBuilder(serviceConfig.data));
			await broker.start()
		});
		afterEach(() => broker.stop());

		it('should throw unauthorize error when getting user challenge',  async () => {
			expect(
				broker.call('challenges.getUserChallenge', { challengeId: '878768' }, {meta: {user: createTestToken()}})
			).rejects.toThrow(/must finish registration process/i)
		});

		it('should throw unauthorize error when updateing user challenge',  async () => {
			expect(
				broker.call('challenges.updateUserChallenge', { challengeId: '878768' }, {meta: {user: createTestToken()}})
			).rejects.toThrow(/must finish registration process/i)
		});
	});

	describe("registered user", () => {
		let broker;

		beforeEach(async () => {
			serviceConfig.extend({ auth: { admins: [{provider: 'google', username: 'monica83' }] } });
			broker = new ServiceBroker({ logger: false });
			broker.createService({
					name: 'userStore',
					actions: {
						get: () => ({
							registered: true
						})
					}
			})
			const schemaBuilder = require(__dirname + "../../../../app/services/challenges/index.js");
			broker.createService(schemaBuilder(serviceConfig.data));
			await broker.start();
		});

		afterEach(() => broker.stop());

		it('should return empty list of challenges by default',  async () => {
			const user = {
				username: 'john',
				role: 'user',
				id: '92864'
			}
			let result = await broker.call('challenges.listUserChallenges', {}, {meta: {user: createTestToken(user)}});
			expect(result).toHaveLength(0);
		});

		it('should create new challenge if does not exist on get operation',  async () => {
			const user = {
				username: 'john',
				role: 'user',
				id: '92864'
			}
			const challengeId = 'challenge-123456XYZ';
			let result = await broker.call('challenges.getUserChallenge', {challengeId}, {meta: {user: createTestToken(user)}});
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('challengeId', challengeId);
			expect(result).toHaveProperty('userId', user.id);
			expect(result).toHaveProperty('code');
			expect(result).toHaveProperty('completed', false);
			expect(result).toHaveProperty('modifiedAt');
		});

		it('should return existing challenge if possible on get operation',  async () => {
			const user = {
				username: 'john',
				role: 'user',
				id: '92864'
			}
			const challengeId = 'challenge-123456XYZ';
			let challenge = await broker.call('challenges.getUserChallenge', {challengeId}, {meta: {user: createTestToken(user)}});
			let result = await broker.call('challenges.getUserChallenge', {challengeId}, {meta: {user: createTestToken(user)}});
			expect(result).toHaveProperty('id', challenge.id);
			expect(result).toHaveProperty('challengeId', challengeId);
			expect(result).toHaveProperty('userId', user.id);
			expect(result).toHaveProperty('code');
			expect(result).toHaveProperty('completed', false);
			expect(result).toHaveProperty('modifiedAt');
		});

		it('should create new challenge if does not exist on update operation',  async () => {
			const user = {
				username: 'john',
				role: 'user',
				id: '92864'
			}
			const challengeId = 'challenge-123456XYZ';
			const code = '//my sample 736432';
			const completed = true;
			let result = await broker.call('challenges.updateUserChallenge', {challengeId, code, completed}, {meta: {user: createTestToken(user)}});
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('challengeId', challengeId);
			expect(result).toHaveProperty('userId', user.id);
			expect(result).toHaveProperty('code', code);
			expect(result).toHaveProperty('completed', completed);
			expect(result).toHaveProperty('modifiedAt');
		});

		it('should return existing challenge if possible on update operation',  async () => {
			const user = {
				username: 'john',
				role: 'user',
				id: '92864'
			}
			const challengeId = 'challenge-123456XYZ';
			const code = '//my sample 736432';
			const completed = true;
			let challenge = await broker.call('challenges.updateUserChallenge', {challengeId}, {meta: {user: createTestToken(user)}});
			let result = await broker.call('challenges.updateUserChallenge', {challengeId, code, completed}, {meta: {user: createTestToken(user)}});
			expect(result).toHaveProperty('id', challenge.id);
			expect(result).toHaveProperty('challengeId', challengeId);
			expect(result).toHaveProperty('userId', user.id);
			expect(result).toHaveProperty('code', code);
			expect(result).toHaveProperty('completed', completed);
			expect(result).toHaveProperty('modifiedAt');
		});

	});
});
