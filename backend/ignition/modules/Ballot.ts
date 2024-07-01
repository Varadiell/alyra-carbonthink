import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { encodeBytes32String } from 'ethers';

const YES = encodeBytes32String('Yes');
const MAYBE = encodeBytes32String('Maybe');
const NO = encodeBytes32String('No');

const BallotModule = buildModule('BallotModule', (module) => {
  const ballot = module.contract('Ballot', [[YES, MAYBE, NO]], {});
  return { ballot };
});

export default BallotModule;
