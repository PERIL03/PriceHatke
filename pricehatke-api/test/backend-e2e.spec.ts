import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PriceHatke Backend E2E Test Suite', () => {
  let app: INestApplication;
  let userToken: string;
  let createdProductId: string;
  let createdAlertId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Health Check Module', () => {
    it('GET /health returns HTTP 200 with DB and Redis status', async () => {
      const response = await request(app.getHttpServer()).get('/health').expect(200);
      expect(response.body.status).toBe('ok');
      expect(typeof response.body.db).toBe('boolean');
      expect(typeof response.body.redis).toBe('boolean');
    });
  });

  describe('2. Authentication Module', () => {
    const testEmail = `e2e_${Date.now()}@pricehatke.com`;
    const testPassword = 'password123';

    it('POST /auth/signup creates a new user and returns JWT tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: testEmail,
          password: testPassword,
          name: 'E2E Test User',
        })
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it('POST /auth/signup rejects duplicate email with 409 Conflict', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(409);
    });

    it('POST /auth/login returns valid tokens for correct credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
      userToken = response.body.accessToken;
    });

    it('GET /auth/me rejects unauthenticated request with 401 Unauthorized', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('GET /auth/me returns user profile with valid Bearer token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.email).toBe(testEmail);
      expect(response.body.referralCode).toBeDefined();
    });
  });

  describe('3. Products Module', () => {
    it('POST /products/resolve resolves an Amazon URL and returns productId', async () => {
      const response = await request(app.getHttpServer())
        .post('/products/resolve')
        .send({
          input: 'https://www.amazon.in/dp/B09V3KXJPB?tag=pricehatke',
        })
        .expect(201);

      expect(response.body.productId).toBeDefined();
      expect(response.body.store).toBe('amazon');
      expect(response.body.currentPrice).toBeGreaterThan(0);
      createdProductId = response.body.productId;
    });

    it('GET /products/:id returns product details and stats', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${createdProductId}`)
        .expect(200);

      expect(response.body.id).toBe(createdProductId);
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.currentPrice).toBeGreaterThan(0);
    });

    it('GET /products/:id/history returns price history time series', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${createdProductId}/history?range=1m`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /products/:id/compare returns cross-store prices', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${createdProductId}/compare`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('4. Alerts Module', () => {
    it('POST /alerts creates an alert for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .post('/alerts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: createdProductId,
          targetPrice: 999999, // Set high target price to guarantee trigger
        })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.status).toBe('active');
      createdAlertId = response.body.id;
    });

    it('GET /alerts lists active user alerts', async () => {
      const response = await request(app.getHttpServer())
        .get('/alerts')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((a: any) => a.id === createdAlertId)).toBe(true);
    });

    it('POST /alerts/evaluate evaluates active alerts and triggers match', async () => {
      const response = await request(app.getHttpServer())
        .post('/alerts/evaluate')
        .expect(201);

      expect(response.body.evaluated).toBeGreaterThan(0);
      expect(response.body.triggered).toBeGreaterThan(0);
    });
  });

  describe('5. Deals Module', () => {
    it('GET /deals returns paginated list of deals', async () => {
      const response = await request(app.getHttpServer()).get('/deals').expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toBeDefined();
    });

    it('GET /deals?minDiscount=50&sort=discount applies filtering and sorting', async () => {
      const response = await request(app.getHttpServer())
        .get('/deals?minDiscount=50&sort=discount')
        .expect(200);

      const deals = response.body.data;
      expect(deals.length).toBeGreaterThan(0);
      deals.forEach((d: any) => {
        expect(d.discountPct).toBeGreaterThanOrEqual(50);
      });
    });
  });
});
