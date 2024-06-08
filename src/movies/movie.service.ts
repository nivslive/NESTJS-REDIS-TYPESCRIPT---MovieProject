import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieRepository } from './movie.repository';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: MovieRepository,
  ) {}

  async createMovie(title: string, description: string): Promise<Movie> {
    const movie = this.movieRepository.create({ title, description });
    return this.movieRepository.save(movie);
  }

  async getAllMovies(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async updateMovie(id: number, title: string, description: string): Promise<Movie> {
    const movie = await this.getMovieById(id);
    movie.title = title;
    movie.description = description;
    return this.movieRepository.save(movie);
  }

  async deleteMovie(id: number): Promise<void> {
    const result = await this.movieRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Movie not found');
    }
  }
}
