import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Products Controller E2E Tests', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/products - Get All Products (Best Case)', () => {
    it('should return all products successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    it('should return products with correct structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      if (response.body.length > 0) {
        response.body.forEach((product: any) => {
          expect(product).toHaveProperty('id');
          expect(product).toHaveProperty('title');
          expect(product).toHaveProperty('price');
        });
      }
    });
  });

  describe('POST /api/products - Create Product (Best Cases)', () => {
    it('should create a valid product successfully', async () => {
      const dto = {
        title: 'New Product',
        price: 999,
      };

      const response = await request(app.getHttpServer())
        .post('/api/products')
        .send(dto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(dto.title);
      expect(response.body.price).toBe(dto.price);
    });

    it('should create multiple products', async () => {
      const titles = ['P1', 'P2', 'P3'];
      const promises: Promise<any>[] = [];

      titles.forEach((title, index) => {
        promises.push(
          request(app.getHttpServer())
            .post('/api/products')
            .send({ title, price: (index + 1) * 10 })
            .expect(201),
        );
      });

      const responses: any[] = await Promise.all(promises);
      expect(responses).toHaveLength(3);
      responses.forEach((res, i) => {
        expect(res.body.title).toBe(titles[i]);
      });
    });
  });

  describe('POST /api/products - Create Product (Worst Cases)', () => {
    it('should fail when title is missing', async () => {
      const dto = { price: 100 };

      await request(app.getHttpServer())
        .post('/api/products')
        .send(dto)
        .expect(400);
    });

    it('should fail when price is missing', async () => {
      const dto = { title: 'No price product' };

      await request(app.getHttpServer())
        .post('/api/products')
        .send(dto)
        .expect(400);
    });

    it('should fail when price is not numeric', async () => {
      const dto = { title: 'Bad price', price: 'abc' };

      await request(app.getHttpServer())
        .post('/api/products')
        .send(dto)
        .expect(400);
    });
  });

  describe('GET /api/products/:id - Get Product by ID (Best Cases)', () => {
    let productId: number;

    beforeAll(async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/products')
        .send({ title: 'Product for get by id', price: 100 })
        .expect(201);

      productId = createResponse.body.id;
    });

    it('should get a product by valid id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', productId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('price');
    });
  });

  describe('GET /api/products/:id - Get Product by ID (Worst Cases)', () => {
    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .get('/api/products/99999')
        .expect(404);
    });

    it('should fail with invalid id format (non-numeric)', async () => {
      await request(app.getHttpServer())
        .get('/api/products/abc')
        .expect(400);
    });
  });

  describe('PUT /api/products/:id - Update Product (Best Cases)', () => {
    let productId: number;

    beforeAll(async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/products')
        .send({ title: 'Initial product', price: 10 })
        .expect(201);
      productId = createResponse.body.id;
    });

    it('should update a product successfully', async () => {
      const dto = { title: 'Updated product', price: 20 };

      const response = await request(app.getHttpServer())
        .put(`/api/products/${productId}`)
        .send(dto)
        .expect(200);

      expect(response.body.message).toContain('updated successfully');
    });
  });

  describe('PUT /api/products/:id - Update Product (Worst Cases)', () => {
    it('should fail updating non-existent product', async () => {
      const dto = { title: 'Does not matter', price: 100 };

      await request(app.getHttpServer())
        .put('/api/products/99999')
        .send(dto)
        .expect(404);
    });

    it('should fail with invalid id format', async () => {
      const dto = { title: 'Invalid id', price: 50 };

      await request(app.getHttpServer())
        .put('/api/products/abc')
        .send(dto)
        .expect(404);
    });

    it('should fail when body is invalid', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/products')
        .send({ title: 'To be updated', price: 10 })
        .expect(201);
      const id = createResponse.body.id;

      await request(app.getHttpServer())
        .put(`/api/products/${id}`)
        .send({ title: 123, price: 'abc' })
        .expect(400);
    });
  });

  describe('DELETE /api/products/:id - Delete Product (Best Cases)', () => {
    it('should delete a product successfully', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/products')
        .send({ title: 'To be deleted', price: 10 })
        .expect(201);
      const id = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .delete(`/api/products/${id}`)
        .expect(200);

      expect(response.body.message).toContain('deleted successfully');
    });
  });

  describe('DELETE /api/products/:id - Delete Product (Worst Cases)', () => {
    it('should fail deleting non-existent product', async () => {
      await request(app.getHttpServer())
        .delete('/api/products/99999')
        .expect(404);
    });

    it('should fail with invalid id format', async () => {
      await request(app.getHttpServer())
        .delete('/api/products/abc')
        .expect(404);
    });
  });

  describe('Complex Scenarios', () => {
    it('should create, read, update, and delete a product (CRUD cycle)', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/api/products')
        .send({ title: 'CRUD product', price: 10 })
        .expect(201);
      const id = createResponse.body.id;

      // Read
      const getResponse = await request(app.getHttpServer())
        .get(`/api/products/${id}`)
        .expect(200);
      expect(getResponse.body.id).toBe(id);

      // Update
      const updateResponse = await request(app.getHttpServer())
        .put(`/api/products/${id}`)
        .send({ title: 'CRUD product updated', price: 20 })
        .expect(200);
      expect(updateResponse.body.message).toContain('updated');

      // Delete
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/api/products/${id}`)
        .expect(200);
      expect(deleteResponse.body.message).toContain('deleted');
    });
  });
});

