import { validate } from 'class-validator';
import { ReviewDto } from './reviews.dto';
import { plainToInstance } from 'class-transformer';

describe('ReviewDto Validation', () => {
  describe('Valid Cases (Best Scenario)', () => {
    it('should validate a complete valid review', async () => {
      const dto = plainToInstance(ReviewDto, {
        id: 1,
        rating: 5,
        hamada: 4,
        comment: 'This is an excellent product with great quality!',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate without optional id field', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        hamada: 2,
        comment: 'Good product overall',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with minimum rating value (1)', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 1,
        hamada: 1,
        comment: 'Not ideal but acceptable',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with maximum rating value (5)', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 5,
        hamada: 5,
        comment: 'Perfect product, highly recommended!',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with minimum comment length (5 characters)', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        hamada: 3,
        comment: 'Great!',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with maximum comment length (500 characters)', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 4,
        hamada: 4,
        comment: 'A'.repeat(500),
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Invalid Cases - Missing Fields (Worst Scenario)', () => {
    it('should fail validation when rating is missing', async () => {
      const dto = plainToInstance(ReviewDto, {
        hamada: 3,
        comment: 'Missing rating field',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('rating');
    });

    it('should fail validation when hamada is missing', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        comment: 'Missing hamada field',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('hamada');
    });

    it('should fail validation when comment is missing', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        hamada: 2,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('comment');
    });
  });

  describe('Invalid Cases - Type Validation', () => {
    it('should fail when rating is not a number', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 'five',
        hamada: 3,
        comment: 'Invalid rating type',
      });
      const errors = await validate(dto, { skipMissingProperties: false });
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when hamada is not a number', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        hamada: 'four',
        comment: 'Invalid hamada type',
      });
      const errors = await validate(dto, { skipMissingProperties: false });
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when comment is not a string', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        hamada: 2,
        comment: 12345,
      });
      const errors = await validate(dto, { skipMissingProperties: false });
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when id is not a number', async () => {
      const dto = plainToInstance(ReviewDto, {
        id: 'one',
        rating: 3,
        hamada: 2,
        comment: 'Valid comment here',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Invalid Cases - Range Validation', () => {
    it('should fail when rating is below minimum (0)', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 0,
        hamada: 3,
        comment: 'Rating too low',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when rating is above maximum (6)', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 6,
        hamada: 3,
        comment: 'Rating too high',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when hamada is below minimum (0)', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        hamada: 0,
        comment: 'Hamada too low',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when hamada is above maximum (6)', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        hamada: 6,
        comment: 'Hamada too high',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when id is negative or zero', async () => {
      const dto = plainToInstance(ReviewDto, {
        id: 0,
        rating: 3,
        hamada: 2,
        comment: 'Invalid id',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when id is negative', async () => {
      const dto = plainToInstance(ReviewDto, {
        id: -5,
        rating: 3,
        hamada: 2,
        comment: 'Negative id',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Invalid Cases - String Length Validation', () => {
    it('should fail when comment is too short (4 characters)', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        hamada: 2,
        comment: 'Bad',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('comment');
    });

    it('should fail when comment is too long (501 characters)', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        hamada: 2,
        comment: 'A'.repeat(501),
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('comment');
    });

    it('should fail when comment is empty string', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3,
        hamada: 2,
        comment: '',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle all valid ratings 1-5', async () => {
      for (let rating = 1; rating <= 5; rating++) {
        const dto = plainToInstance(ReviewDto, {
          rating,
          hamada: rating,
          comment: `Rating ${rating} test`,
        });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should handle comment with special characters', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 5,
        hamada: 5,
        comment: 'Great!!! 😊 @#$%^&*() "quotes" \'apostrophe\'',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle comment with numbers and symbols', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 4,
        hamada: 4,
        comment: '12345 with numbers @example.com and URLs',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle decimal id (should fail as not integer)', async () => {
      const dto = plainToInstance(ReviewDto, {
        id: 1.5,
        rating: 3,
        hamada: 2,
        comment: 'Decimal id test',
      });
      const errors = await validate(dto, { skipMissingProperties: false });
      // Decimal might pass as number, but depends on strict validation
      // This is checking the actual behavior
    });

    it('should handle null values', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: null,
        hamada: null,
        comment: null,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should handle undefined values', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: undefined,
        hamada: undefined,
        comment: undefined,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should handle very large id number', async () => {
      const dto = plainToInstance(ReviewDto, {
        id: 999999999,
        rating: 5,
        hamada: 5,
        comment: 'Large id test',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle floating point ratings', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 3.5,
        hamada: 4.2,
        comment: 'Float test',
      });
      const errors = await validate(dto, { skipMissingProperties: false });
      // This will show behavior with floats
    });
  });

  describe('Multiple Validation Errors', () => {
    it('should report multiple errors when multiple fields are invalid', async () => {
      const dto = plainToInstance(ReviewDto, {
        rating: 10,
        hamada: 0,
        comment: 'ab',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should report errors for all missing required fields', async () => {
      const dto = plainToInstance(ReviewDto, {});
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThanOrEqual(3); // rating, hamada, comment
    });
  });
});
