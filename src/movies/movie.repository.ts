import { EntityRepository, Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieRepository extends Repository<Movie> {}