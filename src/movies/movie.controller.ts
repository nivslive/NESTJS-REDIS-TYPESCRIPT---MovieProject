import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async getAllMovies(): Promise<Movie[]> {
    return this.movieService.getAllMovies();
  }

  @Get(':id')
  async getMovieById(@Param('id') id: string): Promise<Movie> {
    return this.movieService.getMovieById(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMovie(@Body() body: any): Promise<Movie> {
    const { title, description } = body;
    return this.movieService.createMovie(title, description);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateMovie(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('description') description: string,
  ): Promise<Movie> {
    return this.movieService.updateMovie(+id, title, description);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteMovie(@Param('id') id: string): Promise<void> {
    return this.movieService.deleteMovie(+id);
  }
}
