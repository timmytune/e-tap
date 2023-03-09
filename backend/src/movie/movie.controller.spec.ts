import { Test } from '@nestjs/testing';
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieInterface } from './interfaces/movie.interface';
import { Movie } from './movie.entity';

describe('MovieController', () => {
  let movieController: MovieController;
  let movieService: MovieService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [MovieController],
        providers: [MovieService,         {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },],
      }).compile();

    movieService = moduleRef.get<MovieService>(MovieService);
    movieController = moduleRef.get<MovieController>(MovieController);
  });

  describe('create', () => {
    it('should return a creted movie', async () => {

      jest.spyOn(movieService, 'create').mockImplementation(async (mov: MovieInterface): Promise<Movie> => {
        const movie = new Movie();
        movie.id = 1
        movie.title = mov.title
        movie.genre = mov.genre 
        movie.description = mov.description
        movie.created_at = new Date()
        movie.updated_at = new Date()

        return movie
      });

      expect(await movieController.create({title: "one", genre: "two", description: "three"})).toHaveProperty("data.id", 1);
    });
  });

  describe('getOne', () => {
    it('should return a movie', async () => {

      jest.spyOn(movieService, 'findOne').mockImplementation(async (param): Promise<Movie> => {
        const movie = new Movie();
        movie.id = param
        movie.title = "test"
        movie.genre = "test" 
        movie.description = "test"
        movie.created_at = new Date()
        movie.updated_at = new Date()

        return movie
      });

      expect(await movieController.findOne({id: 22})).toHaveProperty("data.id", 22);
    });
  });

  describe('get', () => {
    it('should return list of movies', async () => {

      jest.spyOn(movieService, 'findAll').mockImplementation(async (search: string, skip: number, limit: number, sort: {[key: string]: string}): Promise<[Movie[], number]> => {
        
        let movies: Array<Movie> = []

        for (let i = 0; i < 10; i++) {

          const movie = new Movie();
          movie.id = i + 1
          movie.title = "test" + i
          movie.genre = "test" + i
          movie.description = "test" + i
          movie.created_at = new Date()
          movie.updated_at = new Date()
          movies.push(movie)

        }


        return [movies, 10]
      });

      expect(await movieController.find({})).toHaveProperty("count", 10);
    });
  });


});
