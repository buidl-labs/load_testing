import http from 'k6/http';
import { sleep } from 'k6';

/**
 * Load testing is primarily concerned with assessing the current
 * performance of the system in terms of concurrent users or request per second.
 *
 * Run a load test to:
 * 1. Asses performance of the system under typical & peak load.
 * 2. Makes sure performance standard is continually met as
 * you make changes to the system
 *
 * Mostly used to simulate normal day in the business.
 */

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: true,
  stages: [
    { duration: '5m', target: 100 }, // Simulate ramp up of traffic from 1 user to 100 over 5 mins
    { duration: '10m', target: 100 }, // Stay at 100 users for 10 mins
    { duration: '5m', target: 0 }, // Ramp down to 0 users.
  ],
  thresholds: {
    // // We want the 95th percentile of all HTTP request durations to be less than 500ms
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  let response = http.get('https://solana-backend.onrender.com/nfts/count');

  sleep(1);
}
