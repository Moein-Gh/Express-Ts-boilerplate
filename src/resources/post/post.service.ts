import PostModel from '@/resources/post/post.model';
import Post from '@/resources/post/post.interface';
import { ObjectId } from 'mongodb';

class PostService {
  private post = PostModel;

  /**
      create a new post
     */
  public async create(newPost: Post): Promise<Post> {
    try {
      const post = await this.post.create(newPost);
      return post;
    } catch (error) {
      console.log(error);
      throw new Error('Unable to create post');
    }
  }
  public async getData(id: ObjectId): Promise<Post | null> {
    try {
      const post = await this.post.findById(id);
      return post;
    } catch (error) {
      console.log(error);
      throw new Error('Unable to create post');
    }
  }
  public async getAll(): Promise<Post[] | []> {
    try {
      const posts = await this.post.find({ softDelete: false });
      return posts;
    } catch (error) {
      console.log(error);
      throw new Error('Unable to create post');
    }
  }
}

export default PostService;
