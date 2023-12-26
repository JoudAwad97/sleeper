import { ping } from 'tcp-ping';

describe('Health', () => {
  test('Reservations', async () => {
    const res = await fetch('http://localhost:3000/healthcheck');
    expect(res.ok).toBeTruthy();
  });

  test('Auth', async () => {
    const res = await fetch('http://localhost:3001/healthcheck');
    expect(res.ok).toBeTruthy();
  });

  test('Payments', (done) => {
    // test the microservice TCP connection
    ping({ address: 'payments', port: 3003 }, (err) => {
      if (err) fail();

      done();
    });
  });

  test('Notifications', (done) => {
    // test the microservice TCP connection
    ping({ address: 'notifications', port: 3004 }, (err) => {
      if (err) fail();

      done();
    });
  });
});
