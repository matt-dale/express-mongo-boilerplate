import request from 'supertest';
import auth from '../authentication';
import { connectToServer, closeConnection } from '@db';
import app from '../../server';


describe('Authentication', () => {
  async function prepareServer() {
    await connectToServer((err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
    const localServer = app();
    localServer.listen(65500);
    return localServer;
  }

  afterEach(async () => {
    await closeConnection();
  });

  it('should return a router', () => {
    expect(auth).toBeDefined();
  });
});