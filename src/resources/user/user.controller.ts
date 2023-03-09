import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/root/utils/interfaces/controller.interface';
import HttpException from '@/root/utils/exceptions/http.exceptions';
import validationMiddleware from '@/root/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';
import logMiddleware from '@/root/functions/logMiddleware';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/users/register',
      validationMiddleware(validate.register, 'body'),
      this.isEmailUnique,
      this.register
    );
    this.router.post(
      '/users/login',
      validationMiddleware(validate.login, 'body'),
      this.login
    );

    this.router.get('/users', authenticated, this.getUser);
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, email, password } = req.body;
      const token = await this.UserService.register({
        name,
        email,
        password,
        role: 'user',
      });
      res.status(201).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const token = await this.UserService.login(email, password);
      res.status(201).json({ token });
    } catch (error) {
      next(new HttpException(401, 'unable to login user'));
    }
  };

  private getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) {
        return next(new HttpException(404, 'No logged in user'));
      }
      res.status(200).json({ user: req.user });

      const { email, password } = req.body;
      const token = await this.UserService.login(email, password);
      res.status(201).json({ token });
    } catch (error) {
      next(new HttpException(401, 'unable to login user'));
    }
  };

  private isEmailUnique = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      let { email } = req.body;

      const isEmailUnique = await this.UserService.isEmailUnique(email);
      console.log(isEmailUnique);
      if (!isEmailUnique) {
        next(new HttpException(409, 'ایمیل وارد شده تکراری است'));
      }
      logMiddleware('isEmailUnique');
      return next();
    } catch (error) {
      next(new HttpException(401, 'unable to login user'));
    }
  };
}

export default UserController;
