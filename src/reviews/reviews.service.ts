import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewDto } from './dtos/reviews.dto';

type ReviewType = { id: number; rating: number; comment: string };

@Injectable()
export class ReviewsService {
  private reviews: ReviewType[] = [
    { id: 1, rating: 5, comment: 'Great book!' },
    { id: 2, rating: 4, comment: 'Excellent laptop!' },
    { id: 3, rating: 5, comment: 'Good phone!' },
  ];

  findAll(): ReviewType[] {
    return this.reviews;
  }

  create(dto: ReviewDto): ReviewType {
    const newReview: ReviewType = {
      id: this.reviews.length + 1,
      rating: dto.rating,
      comment: dto.comment,
    };
    this.reviews.push(newReview);
    return newReview;
  }

  findById(id: number): ReviewType {
    const review = this.reviews.find(r => r.id === id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  update(id: number, dto: ReviewDto) {
    const review = this.reviews.find(r => r.id === id);
    if (!review) throw new NotFoundException('Review not found');
    review.rating = dto.rating;
    review.comment = dto.comment;
    return { message: 'Review updated successfully with id ' + id };
  }

  remove(id: number) {
    const index = this.reviews.findIndex(r => r.id === id);
    if (index === -1) throw new NotFoundException('Review not found');
    this.reviews.splice(index, 1);
    return { message: 'Review deleted successfully' };
  }
}
