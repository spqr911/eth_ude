const assert = require('assert');
const ganache = require('ganache-cli');
const { interfaces } = require('mocha');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {abi, bytecode} = require('../compile');
const INITIAL_STRING = 'Hi there!';

let accounts;
let inbox;

beforeEach(async ()=> {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    // Use one of thise accounts to deploy
    // the contract
    inbox = await new web3.eth.Contract((abi))
        .deploy({ data: bytecode, arguments: [INITIAL_STRING]})
        .send({ from: accounts[0], gas: '1000000'});
});

describe('Inbox', () => {
    it('deploys a contract', ()=> {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        var hash = await inbox.methods.setMessage('Bye there!')
        .send({ from: accounts[0], gas: '1000000'});
        
        const message = await inbox.methods.message().call();

        assert.ok(hash);
        assert.equal(message, 'Bye there!');
    })
});