import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Reviews Controller E2E Tests', () => {
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

  describe('GET /api/reviews - Get All Reviews (Best Case)', () => {
    it('should return all reviews successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/reviews')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    it('should return reviews with correct structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/reviews')
        .expect(200);

      if (response.body.length > 0) {
        response.body.forEach((review: any) => {
          expect(review).toHaveProperty('id');
          expect(review).toHaveProperty('rating');
          expect(review).toHaveProperty('comment');
        });
      }
    });
  });

  describe('POST /api/reviews - Create Review (Best Cases)', () => {
    it('should create a valid review successfully', async () => {
      const createReviewDto = {
        rating: 5,
        hamada: 4,
        comment: 'This is an excellent product with great quality!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.rating).toBe(createReviewDto.rating);
      expect(response.body.comment).toBe(createReviewDto.comment);
    });

    it('should create a review with minimum rating (1)', async () => {
      const createReviewDto = {
        rating: 1,
        hamada: 1,
        comment: 'Below average product quality',
      };

      const response = await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(201);

      expect(response.body.rating).toBe(1);
    });

    it('should create a review with maximum rating (5)', async () => {
      const createReviewDto = {
        rating: 5,
        hamada: 5,
        comment: 'Perfect product, highly recommended!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(201);

      expect(response.body.rating).toBe(5);
    });

    it('should create a review with minimum comment length (5 chars)', async () => {
      const createReviewDto = {
        rating: 3,
        hamada: 3,
        comment: 'Great',
      };

      const response = await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(201);

      expect(response.body.comment.length).toBe(5);
    });

    it('should create a review with maximum comment length (500 chars)', async () => {
      const createReviewDto = {
        rating: 4,
        hamada: 4,
        comment: 'A'.repeat(500),
      };

      const response = await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(201);

      expect(response.body.comment.length).toBe(500);
    });

    it('should create review with special characters in comment', async () => {
      const createReviewDto = {
        rating: 4,
        hamada: 3,
        comment: 'Great! @#$%^&*() "quotes" \'apostrophe\' 😊',
      };

      const response = await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(201);

      expect(response.body.comment).toContain('😊');
    });
  });

  describe('POST /api/reviews - Create Review (Worst Cases)', () => {
    it('should fail when rating is missing', async () => {
      const createReviewDto = {
        hamada: 3,
        comment: 'Missing rating field',
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when hamada is missing', async () => {
      const createReviewDto = {
        rating: 3,
        comment: 'Missing hamada field',
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when comment is missing', async () => {
      const createReviewDto = {
        rating: 3,
        hamada: 2,
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when rating is below minimum (0)', async () => {
      const createReviewDto = {
        rating: 0,
        hamada: 3,
        comment: 'Rating too low',
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when rating is above maximum (6)', async () => {
      const createReviewDto = {
        rating: 6,
        hamada: 3,
        comment: 'Rating too high',
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when hamada is below minimum (0)', async () => {
      const createReviewDto = {
        rating: 3,
        hamada: 0,
        comment: 'Hamada too low',
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when hamada is above maximum (6)', async () => {
      const createReviewDto = {
        rating: 3,
        hamada: 6,
        comment: 'Hamada too high',
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when comment is too short (4 chars)', async () => {
      const createReviewDto = {
        rating: 3,
        hamada: 2,
        comment: 'Bad',
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when comment is too long (501 chars)', async () => {
      const createReviewDto = {
        rating: 3,
        hamada: 2,
        comment: 'A'.repeat(501),
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when comment is empty string', async () => {
      const createReviewDto = {
        rating: 3,
        hamada: 2,
        comment: '',
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when rating is not a number', async () => {
      const createReviewDto = {
        rating: 'five',
        hamada: 3,
        comment: 'Invalid rating type',
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when comment is not a string', async () => {
      const createReviewDto = {
        rating: 3,
        hamada: 2,
        comment: 12345,
      };

      await request(app.getHttpServer())
        .post('/api/reviews')
        .send(createReviewDto)
        .expect(400);
    });

    it('should fail when body is empty', async () => {
      await request(app.getHttpServer())
        .post('/api/reviews')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/reviews/:id - Get Review by ID (Best Cases)', () => {
    let reviewId: number;

    beforeAll(async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/reviews')
        .send({
          rating: 5,
          hamada: 4,
          comment: 'Test review for get by id',
        });
      reviewId = createResponse.body.id;
    });

    it('should get a review by valid id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/reviews/${reviewId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', reviewId);
      expect(response.body).toHaveProperty('rating');
      expect(response.body).toHaveProperty('comment');
    });

    it('should return review with correct structure', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/reviews/${reviewId}`)
        .expect(200);

      expect(typeof response.body.id).toBe('number');
      expect(typeof response.body.rating).toBe('number');
      expect(typeof response.body.comment).toBe('string');
    });
  });

  describe('GET /api/reviews/:id - Get Review by ID (Worst Cases)', () => {
    it('should fail when getting non-existent review id', async () => {
      await request(app.getHttpServer())
        .get('/api/reviews/99999')
        .expect(404);
    });

    it('should fail with invalid id format (non-numeric)', async () => {
      await request(app.getHttpServer())
        .get('/api/reviews/abc')
        .expect(400);
    });

    it('should fail with negative id', async () => {
      await request(app.getHttpServer())
        .get('/api/reviews/-1')
        .expect(404);
    });

    it('should fail with zero id', async () => {
      await request(app.getHttpServer())
        .get('/api/reviews/0')
        .expect(404);
    });

    it('should fail with floating point id', async () => {
      await request(app.getHttpServer())
        .get('/api/reviews/1.5')
        .expect(400);
    });
  });

  describe('PUT /api/reviews/:id - Update Review (Best Cases)', () => {
    let reviewId: number;

    beforeAll(async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/reviews')
        .send({
          rating: 2,
          hamada: 2,
          comment: 'Initial review for update test',
        });
      reviewId = createResponse.body.id;
    });

    it('should update a review successfully', async () => {
      const updateDto = {
        rating: 5,
        hamada: 5,
        comment: 'Updated to excellent review',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/reviews/${reviewId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.message).toContain('updated successfully');
    });

    it('should update review with minimum values', async () => {
      const updateDto = {
        rating: 1,
        hamada: 1,
        comment: 'Updated to minimum',
      };

      await request(app.getHttpServer())
        .put(`/api/reviews/${reviewId}`)
        .send(updateDto)
        .expect(200);
    });

    it('should update review with maximum values', async () => {
      const updateDto = {
        rating: 5,
        hamada: 5,
        comment: 'A'.repeat(500),
      };

      await request(app.getHttpServer())
        .put(`/api/reviews/${reviewId}`)
        .send(updateDto)
        .expect(200);
    });

    it('should update review with different rating', async () => {
      const updateDto = {
        rating: 3,
        hamada: 4,
        comment: 'Updated with different rating',
      };

      await request(app.getHttpServer())
        .put(`/api/reviews/${reviewId}`)
        .send(updateDto)
        .expect(200);
    });
  });

  describe('PUT /api/reviews/:id - Update Review (Worst Cases)', () => {
    it('should fail updating non-existent review', async () => {
      const updateDto = {
        rating: 5,
        hamada: 4,
        comment: 'Update non-existent review',
      };

      await request(app.getHttpServer())
        .put('/api/reviews/99999')
        .send(updateDto)
        .expect(404);
    });

    it('should fail updating with invalid rating (0)', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/reviews')
        .send({
          rating: 3,
          hamada: 3,
          comment: 'Review to update with invalid rating',
        });
      const reviewId = createResponse.body.id;

      const updateDto = {
        rating: 0,
        hamada: 3,
        comment: 'Invalid rating',
      };

      await request(app.getHttpServer())
        .put(`/api/reviews/${reviewId}`)
        .send(updateDto)
        .expect(400);
    });

    it('should fail updating with rating above maximum', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/reviews')
        .send({
          rating: 3,
          hamada: 3,
          comment: 'Review to update with high rating',
        });
      const reviewId = createResponse.body.id;

      const updateDto = {
        rating: 10,
        hamada: 3,
        comment: 'Rating too high',
      };

      await request(app.getHttpServer())
        .put(`/api/reviews/${reviewId}`)
        .send(updateDto)
        .expect(400);
    });

    it('should fail updating with missing rating', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/reviews')
        .send({
          rating: 3,
          hamada: 3,
          comment: 'Review to update missing rating',
        });
      const reviewId = createResponse.body.id;

      const updateDto = {
        hamada: 3,
        comment: 'Missing rating',
      };

      await request(app.getHttpServer())
        .put(`/api/reviews/${reviewId}`)
        .send(updateDto)
        .expect(400);
    });

    it('should fail updating with comment too short', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/reviews')
        .send({
          rating: 3,
          hamada: 3,
          comment: 'Review to update short comment',
        });
      const reviewId = createResponse.body.id;

      const updateDto = {
        rating: 3,
        hamada: 3,
        comment: 'Bad',
      };

      await request(app.getHttpServer())
        .put(`/api/reviews/${reviewId}`)
        .send(updateDto)
        .expect(400);
    });

    it('should fail updating with comment too long', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/reviews')
        .send({
          rating: 3,
          hamada: 3,
          comment: 'Review to update long comment',
        });
      const reviewId = createResponse.body.id;

      const updateDto = {
        rating: 3,
        hamada: 3,
        comment: 'A'.repeat(501),
      };

      await request(app.getHttpServer())
        .put(`/api/reviews/${reviewId}`)
        .send(updateDto)
        .expect(400);
    });

    it('should fail with invalid id format', async () => {
      const updateDto = {
        rating: 3,
        hamada: 3,
        comment: 'Invalid id format test',
      };

      await request(app.getHttpServer())
        .put('/api/reviews/abc')
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /api/reviews/:id - Delete Review (Best Cases)', () => {
    it('should delete a review successfully', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/reviews')
        .send({
          rating: 3,
          hamada: 3,
          comment: 'Review to be deleted',
        });
      const reviewId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .delete(`/api/reviews/${reviewId}`)
        .expect(200);

      expect(response.body.message).toContain('deleted successfully');
    });

    it('should delete multiple reviews', async () => {
      for (let i = 0; i < 3; i++) {
        const createResponse = await request(app.getHttpServer())
          .post('/api/reviews')
          .send({
            rating: 3,
            hamada: 3,
            comment: `Review ${i} to be deleted`,
          });
        const reviewId = createResponse.body.id;

        await request(app.getHttpServer())
          .delete(`/api/reviews/${reviewId}`)
          .expect(200);
      }
    });
  });

  describe('DELETE /api/reviews/:id - Delete Review (Worst Cases)', () => {
    it('should fail deleting non-existent review', async () => {
      await request(app.getHttpServer())
        .delete('/api/reviews/99999')
        .expect(404);
    });

    it('should fail with invalid id format (non-numeric)', async () => {
      await request(app.getHttpServer())
        .delete('/api/reviews/abc')
        .expect(404);
    });

    it('should fail deleting already deleted review', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/reviews')
        .send({
          rating: 3,
          hamada: 3,
          comment: 'Review to delete twice',
        });
      const reviewId = createResponse.body.id;

      // First delete
      await request(app.getHttpServer())
        .delete(`/api/reviews/${reviewId}`)
        .expect(200);

      // Second delete should fail
      await request(app.getHttpServer())
        .delete(`/api/reviews/${reviewId}`)
        .expect(404);
    });

    it('should fail with negative id', async () => {
      await request(app.getHttpServer())
        .delete('/api/reviews/-1')
        .expect(404);
    });
  });

  describe('Complex Scenarios', () => {
    it('should create, read, update, and delete a review (CRUD cycle)', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/api/reviews')
        .send({
          rating: 2,
          hamada: 2,
          comment: 'Initial CRUD test review',
        })
        .expect(201);
      const reviewId = createResponse.body.id;
      expect(createResponse.body.rating).toBe(2);

      // Read
      const getResponse = await request(app.getHttpServer())
        .get(`/api/reviews/${reviewId}`)
        .expect(200);
      expect(getResponse.body.id).toBe(reviewId);

      // Update
      const updateResponse = await request(app.getHttpServer())
        .put(`/api/reviews/${reviewId}`)
        .send({
          rating: 5,
          hamada: 4,
          comment: 'Updated CRUD test review',
        })
        .expect(200);
      expect(updateResponse.body.message).toContain('updated');

      // Verify update
      const verifyResponse = await request(app.getHttpServer())
        .get(`/api/reviews/${reviewId}`)
        .expect(200);
      expect(verifyResponse.body.rating).toBe(5);

      // Delete
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/api/reviews/${reviewId}`)
        .expect(200);
      expect(deleteResponse.body.message).toContain('deleted');

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/api/reviews/${reviewId}`)
        .expect(404);
    });

    it('should handle concurrent review creations', async () => {
      const promises: Promise<any>[] = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          request(app.getHttpServer())
            .post('/api/reviews')
            .send({
              rating: (i % 5) + 1,
              hamada: (i % 5) + 1,
              comment: `Concurrent review ${i}`,
            })
            .expect(201),
        );
      }

      const responses: any[] = await Promise.all(promises);
      expect(responses).toHaveLength(5);
      responses.forEach((response: any) => {
        expect(response.body).toHaveProperty('id');
      });
    });

    it('should maintain data integrity after multiple operations', async () => {
      const allReviewsStart = await request(app.getHttpServer())
        .get('/api/reviews')
        .expect(200);
      const countStart = allReviewsStart.body.length;

      // Create 3 reviews
      const created: number[] = [];
      for (let i = 0; i < 3; i++) {
        const response = await request(app.getHttpServer())
          .post('/api/reviews')
          .send({
            rating: 3,
            hamada: 3,
            comment: `Integrity test ${i}`,
          })
          .expect(201);
        created.push(response.body.id);
      }

      // Verify count increased
      const allReviewsAfterCreate = await request(app.getHttpServer())
        .get('/api/reviews')
        .expect(200);
      expect(allReviewsAfterCreate.body.length).toBe(countStart + 3);

      // Delete 2 reviews
      await request(app.getHttpServer())
        .delete(`/api/reviews/${created[0]}`)
        .expect(200);
      await request(app.getHttpServer())
        .delete(`/api/reviews/${created[1]}`)
        .expect(200);

      // Verify count decreased by 2
      const allReviewsAfterDelete = await request(app.getHttpServer())
        .get('/api/reviews')
        .expect(200);
      expect(allReviewsAfterDelete.body.length).toBe(countStart + 1);
    });
  });
});
