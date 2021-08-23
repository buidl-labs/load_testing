import http from 'k6/http';
import { sleep } from 'k6';

/**
 * Spike test is a variation of a stress test , but it does not gradually increase
 * the load, instead it spikes to extreme load over a short period of time.
 *
 * Run to determine:
 * 1. How the system will perform under a sudden surge in traffic
 * 2. Determine if the system will recover once the system is subsided
 */

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: true,
  stages: [
    { duration: '10s', target: 100 }, // below normal load
    { duration: '1m', target: 100 },
    { duration: '10s', target: 750 }, //spike to 1400 users
    { duration: '3m', target: 750 }, //stay at 1400 for 3 mins
    { duration: '10s', target: 100 }, //scale down. Recover stage.
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    // // We want the 95th percentile of all HTTP request durations to be less than 500ms
    http_req_duration: ['p(95)<1500'],
    // Thresholds based on the custom metric we defined and use to track application failures
    check_failure_rate: [
      // Global failure rate should be less than 1%
      'rate<0.01',
      // Abort the test early if it climbs over 5%
      { threshold: 'rate<=0.05', abortOnFail: true },
    ],
  },
};

export default function () {
  let response = http.get('https://solana-backend.onrender.com/nfts/count');

  sleep(1);
}
