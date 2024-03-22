import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RegisterUserDTO } from "./dtos/RegisterUser.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { comparePassword, hashPassword } from "src/utils/hashString";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDTO } from "./dtos/LoginUser.dto";

interface IResponse {
  message: string;
  code: number;
  status: "success" | "failure";
  data?: {
    [key: string]: string | object;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(registerUser: RegisterUserDTO): Promise<IResponse> {
    const passHashed = await hashPassword(registerUser.password);
    const user = await this.prismaService.users.findFirst({
      where: { email: registerUser.email },
    });
    if (user)
      throw new HttpException("El correo esta en uso", HttpStatus.BAD_REQUEST);
    const newUser = await this.prismaService.users.create({
      data: {
        ...registerUser,
        password: passHashed,
      },
    });
    const token = this.jwtService.sign({
      id: newUser.id,
      email: newUser.email,
    });
    return {
      message: "Operation successful",
      data: {
        token,
        newUser,
      },
      code: HttpStatus.OK,
      status: "success",
    };
  }

  async loginUser(loginUser: LoginUserDTO): Promise<IResponse> {
    const user = await this.prismaService.users.findFirst({
      where: { email: loginUser.email },
    });
    // const { id: productId } = await this.prismaService.products.create({
    //   data: {
    //     name: "",
    //   },
    // });
    // await this.prismaService.prices.create({
    //   data: {
    //     price: "2000",
    //     productId,
    //     store: "Amzon",
    //   },
    // });

    const products = await this.prismaService.products.findMany({
      include: {
        prices: {
          where: { price: { gt: "1999" } },
          select: {
            price: true,
            store: true,
          },
        },
        _count: true,
      },
    });
    console.log({ products });
    if (!user)
      throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

    const match = await comparePassword(loginUser.password, user.password);
    if (!match)
      throw new HttpException("Contraseña incorrecta", HttpStatus.BAD_REQUEST);
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return {
      code: HttpStatus.OK,
      status: "success",
      message: "Operation successfull",
      data: {
        token,
        products,
      },
    };
  }
}
