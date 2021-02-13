import * as crypto from 'crypto';
import * as CoinbasePro from 'coinbase-pro';

// TODO replace with calls to SSM with KMS encryption
const secret = process.env.COINBASE_SECRET_KEY;
const key = process.env.COINBASE_KEY;
const passphrase = process.env.COINBASE_PASSWORD;
// prod: 'https://api.pro.coinbase.com'
// sandbox: https://api-public.sandbox.pro.coinbase.com
const endpoint = process.env.COINBASE_ENDPOINT;
// 'wss://ws-feed-public.sandbox.pro.coinbase.com'
const socketEndpoint = process.env.COINBASE_SOCKET_ENDPOINT;

export function sign<T>(method = 'POST', body: T, requestPath) {
  const timestamp = Date.now() / 1000;

  // create the prehash string by concatenating required parts
  const what = timestamp + method + requestPath + body;

  // decode the base64 secret
  const key = new Buffer(secret, 'base64');

  // create a sha256 hmac with the secret
  const hmac = crypto.createHmac('sha256', key);

  // sign the require message with the hmac
  // and finally base64 encode the result
  return hmac.update(what).digest('base64');
}

export function getAuthenticatedClient(): CoinbasePro.AuthenticatedClient {
  return new CoinbasePro.AuthenticatedClient(key, secret, passphrase, endpoint);
}
// TODO restrict products to enums
function getAuthenticatedSocket(
  products?: string[],
  channels = ['ticker', 'status'],
): CoinbasePro.WebsocketClient {
  return new CoinbasePro.WebsocketClient(
    products,
    socketEndpoint,
    {
      key,
      secret,
      passphrase,
    },
    { channels },
  );
}

export type SubscriptionType = {
  disconnect: () => void;
  unsubscribe: () => void;
};

export type SubscriberType = {
  onData: (data: CoinbasePro.WebsocketMessage) => void;
  onError: (error: unknown) => void;
  onClose: () => void;
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function subscribe(
  subscriber: SubscriberType,
  products?: string[],
  channels = ['ticker', 'level2'],
  keepAlive = true,
): SubscriptionType {

  let websocket = getAuthenticatedSocket(products, channels);

  websocket.on('message', (data) => {
    /* work with data */
    subscriber.onData(data);
  });
  websocket.on('error', (err) => {
    subscriber.onError(err);
    // reconnect
    subscribe(subscriber, products, channels);
  });
  websocket.on('close', () => {
    /* ... */
    subscriber.onClose();
    if (keepAlive) {
      subscribe(subscriber, products, channels);
    }
  });
  // TODO comment in if we need to explicitly connect
  // websocket.connect();

  return {
    disconnect: () => {
      websocket.disconnect();
    },
    unsubscribe: () => {
      // @ts-ignore
      websocket.unsubscribe(products, channels);
    },
  };
}
