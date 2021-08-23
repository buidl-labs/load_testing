import http from 'k6/http';
import { sleep } from 'k6';

/**
 * Stress testing is a type of testing which is used to determine
 * the limit of a system.
 *
 * The purpose of this test is to verify the stability and reliability of the system
 * under extreme conditions.
 *
 * More of a load test than a spike test.
 */

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: true,
  stages: [
    { duration: '2m', target: 100 }, // Below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // Normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // Around the breaking point
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // Beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 }, // Scale down. Recover stage.
  ],
};

export default function () {
  let response = http.get('https://solana-backend.onrender.com/nfts/count');

  sleep(1);
}
