import { Controller, Get, Post, Req, Body, Param } from '@nestjs/common';
import { ReturnData } from 'src/interfaces/Return.Data.interface';
import { Movie } from './movie.entity';
import { Request } from 'express';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create.movie.dto';
import { FindOneParams } from './dto/get.one.dto';


enum MovieSortableFields {
    id = 'id',
    title = 'title',
    genre = 'genre',
    created_at = 'created_at',
    updated_at = 'updated_at'
}

@Controller('movie')
export class MovieController {

    constructor(
        private movieService: MovieService,
    ){}

    @Post()
    async create(@Body() movieDTO: CreateMovieDto): Promise<ReturnData<Movie>> {
        try {
            let movie = await this.movieService.create(movieDTO)
            return {message: "request successfull", data: movie}
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    @Get("/:id")
    async findOne(@Param() params: FindOneParams): Promise<ReturnData<Movie>> {
        try {
            let movie = await this.movieService.findOne(params.id)
            return {message: "request successfull", data: movie}
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    @Get()
    async find(@Req() request: Request): Promise<ReturnData<Array<Movie>>> {
        try {

            let limit = 100
            let skip = 0
            let search = ""
            let sort: {[key: string]: string} = {}

            let query = request.query

            if(query) {


                if(query["limit"] && typeof query["limit"] === 'string'){
                    limit = parseInt(query["limit"])
                }

                if(query["skip"] && typeof query["skip"] === 'string'){
                    skip = parseInt(query["skip"])
                }

                if(query["search"] && typeof query["search"] === 'string'){
                    search = query["search"]
                }

                if(query["sort"] && typeof query["sort"] === 'string'){

                    let sorts = query["sort"].split("-")
                    if(sorts.length == 2 && (sorts[1] == "ASC" || sorts[1] == "DESC") && sorts[0] in MovieSortableFields){
                        sort[sorts[0]] = sorts[1]
                    }

                }

                if(query["sort"] && typeof Array.isArray(query["sort"])){

                    for (let i = 0; i < query['sort'].length; i++) {
                        const ele = query['sort'][i];
                        let sorts = ele.split("-")
                        if(sorts.length == 2 && (sorts[1] == "ASC" || sorts[1] == "DSC") && sorts[0] in MovieSortableFields){
                            sort[sorts[0]] = sorts[1]
                        }
                    }

                }
            }

            let [movies, count] = await this.movieService.findAll(search, skip, limit, sort)

            return {message: 'request sucessfull', data: movies, count: count, skip: skip, limit: limit}
            
        } catch (error) {
            console.log(error) // this should be bettoer
            throw error   
        }
    }
}
