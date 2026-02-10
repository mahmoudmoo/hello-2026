import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Put,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';

import { ReviewDto } from './dtos/reviews.dto';
import { ReviewsService } from './reviews.service';

@Controller()
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}
    
    // GET /api/reviews - Get all reviews
    @Get('/api/reviews')
    public getAllReviews() {
        return this.reviewsService.findAll();
    }

    // POST /api/reviews - Create a new review
    @Post('/api/reviews')
    public createReview(@Body() body: ReviewDto) {
        return this.reviewsService.create(body);
    }

    // GET /api/reviews/:id - Get review by id
    @Get('/api/reviews/:id')
    public getReviewById(@Param('id', ParseIntPipe) id: number) {
        return this.reviewsService.findById(id);
    }

    // PUT /api/reviews/:id - Update review by id
    @Put('/api/reviews/:id')
    public updateReview(@Param('id') id: string, @Body() body: ReviewDto) {
        return this.reviewsService.update(parseInt(id), body);
    }

    // DELETE /api/reviews/:id - Delete review by id
    @Delete('/api/reviews/:id')
    public deleteReview(@Param('id') id: string) {
        return this.reviewsService.remove(parseInt(id));
    }
}