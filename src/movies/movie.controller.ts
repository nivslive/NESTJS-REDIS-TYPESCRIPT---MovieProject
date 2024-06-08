import { Injectable, NotFoundException, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieRepository } from './movie.repository';
import { Cache } from 'cache-manager';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: MovieRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createMovie(title: string, description: string): Promise<Movie> {
    const movie = this.movieRepository.create({ title, description });
    const savedMovie = await this.movieRepository.save(movie);
    await this.cacheManager.del('movies');
    return savedMovie;
  }

  async getAllMovies(): Promise<Movie[]> {
    const cachedMovies = await this.cacheManager.get<Movie[]>('movies');
    if (cachedMovies) {
      return cachedMovies;
    }

    const movies = await this.movieRepository.find();
    await this.cacheManager.set('movies', movies, { ttl: 600 });
    return movies;
  }

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async updateMovie(
    id: number,
    title: string,
    description: string,
  ): Promise<Movie> {
    const movie = await this.getMovieById(id);
    movie.title = title;
    movie.description = description;
    const updatedMovie = await this.movieRepository.save(movie);
    await this.cacheManager.del('movies');
    return updatedMovie;
  }

  async deleteMovie(id: number): Promise<void> {
    const result = await this.movieRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Movie not found');
    }
    await this.cacheManager.del('movies');
  }
}
