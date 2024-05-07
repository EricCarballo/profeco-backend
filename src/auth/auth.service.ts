import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { CreateUserDto, LoginDto,  UpdateAuthDto} from './dto';
import { User } from './entities/auth.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name ) 
    private readonly UserModel: Model<User>,
    private readonly jwtServices: JwtService,
  ) {}

  async create( createUserDto: CreateUserDto ): Promise<User> {
    
    try {
      
      const { password, ...userData } = createUserDto;
      const newUser = new this.UserModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });

      await newUser.save();
      const { password:_, ...user } = newUser.toJSON();

      return user;
      
    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } already exists!`)
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }

  }

  async register( registerDto ): Promise<LoginResponse> {
    const user = await this.create( registerDto );

    return {
      user: user,
      token: this.getJwtToken({ id: user._id })
    }
  }

  async login( loginDto: LoginDto ): Promise<LoginResponse> {

    const { email, password } = loginDto

    const user = await this.UserModel.findOne({ email });
    if( !user ){
      throw new UnauthorizedException('Credenciales no válidas! - email')
    }

    if( !bcryptjs.compareSync( password, user.password )) {
      throw new UnauthorizedException('Credenciales no válidas! - password')
    }

    const { password:_, ...rest } = user.toJSON()

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }

  }

  findAll() {
    return this.UserModel.find();
  }

  async getProfile(id: string) {
    const user = await this.UserModel.findOne({userId: id});
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  async findUserById( id: string ) {
    const user = await this.UserModel.findById( id );
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload ) {
    const token = this.jwtServices.sign(payload)
    return token;
  }
  
}
