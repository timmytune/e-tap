import { Controller, Get } from '@nestjs/common';
import { ReturnData } from './interfaces/Return.Data.interface';

@Controller()
export class AppController {

  @Get()
  Home(): ReturnData<null> {
    return {message: "welcome to etap test!"}
  }
  
}
