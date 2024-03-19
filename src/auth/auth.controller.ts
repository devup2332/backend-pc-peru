import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { RegisterUserDTO } from "./dtos/RegisterUser.dto";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { LoginUserDTO } from "./dtos/LoginUser.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("registerUser")
  async registerUser(
    @Res() res: Response,
    @Body() registerUser: RegisterUserDTO,
  ) {
    try {
      const response = await this.authService.registerUser(registerUser);
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  @Post("loginUser")
  async loginUser(@Res() res: Response, @Body() loginUser: LoginUserDTO) {
    try {
      const response = await this.authService.loginUser(loginUser);
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
