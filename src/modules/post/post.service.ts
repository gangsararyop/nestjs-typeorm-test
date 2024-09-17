import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const newPost = this.postsRepository.create(createPostDto);

    return await this.postsRepository.insert(newPost);
  }

  async findAll() {
    return await this.postsRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.postsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    return await this.postsRepository.softDelete(id);
  }

  async bulkCreate(createPostsDto: CreatePostDto[]) {
    const newPosts = this.postsRepository.create(createPostsDto);

    return await this.postsRepository.insert(newPosts);
  }
}
