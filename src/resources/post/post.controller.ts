import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exceptions';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';
import logMiddleware from '@/root/functions/logMiddleware';
import { ObjectId } from 'mongodb';
import Post from './post.interface';

class PostController implements Controller {
  public path = '/posts';
  public router = Router();
  private PostService = new PostService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /*****************
     * CREATE A POST *
     *****************/
    this.router.post(
      `/posts/create`,
      validationMiddleware(validate.create, 'body'),
      this.create,
      this.postMessage
    );

    /**************
     * GET A POST *
     **************/
    this.router.get(
      `/posts/getData/:postId`,
      this.getData,
      this.formatPost,
      this.sendPost
    );

    /*****************
     * GET All POSTs *
     *****************/
    this.router.get(
      `/posts/list`,
      this.getAll,
      this.formatPosts,
      this.sendPosts
    );
  }

  ///////////////////////////////
  /////////// METHODS ///////////
  ///////////////////////////////

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const newPost = req.body;
      res.locals.postData = await this.PostService.create(newPost);
      res.locals.message = 'post_created';
      logMiddleware('Post.create');
      return next();
    } catch (error) {
      console.log(error);
      next(
        new HttpException(
          500,
          'در فراینت ساخت پست مشکلی پیش آمده است. لطفا با پشتیبانی تماس بگیرید'
        )
      );
    }
  };
  public getData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      let postId: ObjectId = new ObjectId(req.params.postId);
      const post = await this.PostService.getData(postId);
      if (post == null) {
        return res.status(404).send('پست موردنظر یافت نشد');
      }
      res.locals.postData = post;
      logMiddleware('Post.getData');
      return next();
    } catch (error) {
      console.log(error);
      next(
        new HttpException(
          500,
          'در فراینت ساخت پست مشکلی پیش آمده است. لطفا با پشتیبانی تماس بگیرید'
        )
      );
    }
  };
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const posts = await this.PostService.getAll();

      res.locals.posts = posts;
      logMiddleware('Post.getData');
      return next();
    } catch (error) {
      console.log(error);
      next(
        new HttpException(
          500,
          'در فراینت ساخت پست مشکلی پیش آمده است. لطفا با پشتیبانی تماس بگیرید'
        )
      );
    }
  };
  public formatPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      let post = res.locals.postData;
      res.locals.postData = {
        title: post.title,
        body: post.body,
      };
      logMiddleware('formatPost');
      return next();
    } catch (error) {
      console.log(error);

      next(
        new HttpException(
          500,
          'در فراینت ساخت پست مشکلی پیش آمده است. لطفا با پشتیبانی تماس بگیرید'
        )
      );
    }
  };
  public formatPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      let posts = res.locals.posts;
      res.locals.posts = posts.map((post: Post) => {
        return {
          title: post.title,
          body: post.body,
        };
      });
      logMiddleware('formatPost');
      return next();
    } catch (error) {
      console.log(error);

      next(
        new HttpException(
          500,
          'در فراینت ساخت پست مشکلی پیش آمده است. لطفا با پشتیبانی تماس بگیرید'
        )
      );
    }
  };
  public sendPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      let post = res.locals.postData;
      return res.send(post);
    } catch (error) {
      console.log(error);

      next(
        new HttpException(
          500,
          'در فراینت ساخت پست مشکلی پیش آمده است. لطفا با پشتیبانی تماس بگیرید'
        )
      );
    }
  };
  public sendPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      let posts = res.locals.posts;
      return res.send(posts);
    } catch (error) {
      console.log(error);

      next(
        new HttpException(
          500,
          'در فراینت ساخت پست مشکلی پیش آمده است. لطفا با پشتیبانی تماس بگیرید'
        )
      );
    }
  };
  public postMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      switch (res.locals.message) {
        case 'post_created':
          res.send({
            message: 'پست با موفقیت ایجاد شد',
            id: res.locals.postData._id,
          });
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);

      next(
        new HttpException(
          500,
          'در فراینت ساخت پست مشکلی پیش آمده است. لطفا با پشتیبانی تماس بگیرید'
        )
      );
    }
  };
}

export default PostController;
