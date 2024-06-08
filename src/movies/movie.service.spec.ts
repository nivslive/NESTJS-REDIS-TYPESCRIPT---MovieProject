import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieService } from './movie.service';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

describe('MovieService', () => {
  let service: MovieService;
  let repository: Repository<Movie>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMovie', () => {
    it('should create and return a movie', async () => {
      const movie = new Movie();
      movie.title = 'Test Movie';
      movie.description = 'Test Description';

      jest.spyOn(repository, 'create').mockReturnValue(movie);
      jest.spyOn(repository, 'save').mockResolvedValue(movie);
      jest.spyOn(cacheManager, 'del').mockImplementation();

      const result = await service.createMovie(movie.title, movie.description);
      expect(result).toEqual(movie);
      expect(cacheManager.del).toHaveBeenCalledWith('movies');
    });
  });

  describe('getAllMovies', () => {
    it('should return all movies from cache', async () => {
      const movies = [new Movie()];
      jest.spyOn(cacheManager, 'get').mockResolvedValue(movies);

      const result = await service.getAllMovies();
      expect(result).toEqual(movies);
    });

    it('should return all movies from database if cache is empty', async () => {
      const movies = [new Movie()];
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'find').mockResolvedValue(movies);
      jest.spyOn(cacheManager, 'set').mockImplementation();

      const result = await service.getAllMovies();
      expect(result).toEqual(movies);
      expect(cacheManager.set).toHaveBeenCalledWith('movies', movies, { ttl: 600 });
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by ID', async () => {
      const movie = new Movie();
      jest.spyOn(repository, 'findOne').mockResolvedValue(movie);

      const result = await service.getMovieById(1);
      expect(result).toEqual(movie);
    });

    it('should throw NotFoundException if movie not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getMovieById(1)).rejects.toThrow();
    });
  });

  describe('updateMovie', () => {
    it('should update and return the movie', async () => {
      const movie = new Movie();
      movie.title = 'Updated Title';
      movie.description = 'Updated Description';

      jest.spyOn(service, 'getMovieById').mockResolvedValue(movie);
      jest.spyOn(repository, 'save').mockResolvedValue(movie);
      jest.spyOn(cacheManager, 'del').mockImplementation();

      const result = await service.updateMovie(
        1,
        'Updated Title',
        'Updated Description',
      );
      expect(result).toEqual(movie);
      expect(cacheManager.del).toHaveBeenCalledWith('movies');
    });
  });

  describe('deleteMovie', () => {
    it('should delete the movie', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 });
      jest.spyOn(cacheManager, 'del').mockImplementation();

      await service.deleteMovie(1);
      expect(cacheManager.del).toHaveBeenCalledWith('movies');
    });

    it('should throw NotFoundException if movie not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 });

      await expect(service.deleteMovie(1)).rejects.toThrow();
    });
  });
});
