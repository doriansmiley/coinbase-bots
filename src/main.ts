import { subscribe } from './core/Core';
import * as CoinbasePro from 'coinbase-pro';
import debug from 'debug';

// send errors to stderr
const logError = debug('coinbase-bots:log:error');
const logInfo = debug('coinbase-bots:log:info');

const products = ['ETH-BTC'];

function onData(data: CoinbasePro.WebsocketMessage) {
  if (data?.type !== 'heartbeat') {
    logInfo(data);
  }
}

function onError(error: unknown): void {
  logError(error);
}

function onClose() {
  logInfo('websocket closed');
}

logInfo('init subscription');

subscribe({ onData, onError, onClose }, products);
