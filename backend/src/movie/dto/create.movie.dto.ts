import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}