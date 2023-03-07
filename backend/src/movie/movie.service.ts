import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { MovieInterface } from './interfaces/movie.interface';
import { Movie } from './movie.entity';


@Injectable()
export class MovieService {

    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
    ){}

  async create(mov: MovieInterface): Promise<Movie> {
    return this.moviesRepository.save(mov);
  }

  findOne(id: number): Promise<Movie> {
    return this.moviesRepository.findOneBy({ id });
  }

  findAll(search: string, skip: number, limit: number, sort: {[key: string]: string}): Promise<[Movie[], number]> {

    let where: {[key: string]: any} = {}
    
    if(search != ""){
        where = [
            {title: ILike(`%${search}%`)},
            {genre: ILike(`%${search}%`)}
        ]
    }


    let query: FindManyOptions = {
        where: where,
        skip: skip,
        take: limit
    }

    if(Object.keys(sort).length){
        query.order = sort
    }

    return this.moviesRepository.findAndCount(query)
  }
}