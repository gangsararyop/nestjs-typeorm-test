import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post/entities/post.entity';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserPostDto } from './dto/create-user-post.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);

    return await this.usersRepository.insert(newUser);
  }

  async findAll() {
    return await this.usersRepository.find({});
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.usersRepository.softDelete(id);
  }

  async createUserPost(createUserPostDto: CreateUserPostDto) {
    const userPayload = {
      fullName: createUserPostDto.fullName,
      email: createUserPostDto.email,
    };

    const postPayload = {
      title: 'test 123446677',
      text: createUserPostDto.text,
    };

    return await this.dataSource.manager.transaction(async (entityManager) => {
      const user = entityManager.create(User, userPayload);
      const newUser = await entityManager.insert(User, user);

      const post = entityManager.create(Post, {
        ...postPayload,
        userId: newUser.generatedMaps?.[0]?.id,
      });
      await entityManager.insert(Post, {
        ...post,
      });

      return 'Success Message';
    });
  }
}
