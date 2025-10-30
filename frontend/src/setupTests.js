import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock window.ethereum
const mockEthereum = {
  isMetaMask: true,
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

global.ethereum = mockEthereum;

// Mock Web3 and ethers
jest.mock('ethers', () => ({
  ...jest.requireActual('ethers'),
  ethers: {
    ...jest.requireActual('ethers').ethers,
    providers: {
      Web3Provider: jest.fn().mockImplementation(() => ({
        getSigner: jest.fn().mockReturnValue({
          getAddress: jest.fn().mockResolvedValue('0x1234567890123456789012345678901234567890'),
        }),
      })),
    },
    Contract: jest.fn().mockImplementation(() => ({
      owner: jest.fn().mockResolvedValue('0x1234567890123456789012345678901234567890'),
      withdrawToken: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({}),
      }),
      withdrawNative: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({}),
      }),
    })),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

global.localStorage = localStorageMock;

// Add TextEncoder and TextDecoder for Jest
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock window.ethereum.request
window.ethereum.request = jest.fn().mockImplementation(({ method }) => {
  switch (method) {
    case 'eth_requestAccounts':
      return Promise.resolve(['0x1234567890123456789012345678901234567890']);
    case 'eth_accounts':
      return Promise.resolve(['0x1234567890123456789012345678901234567890']);
    case 'eth_chainId':
      return Promise.resolve('0x1');
    default:
      return Promise.resolve(null);
  }
});
