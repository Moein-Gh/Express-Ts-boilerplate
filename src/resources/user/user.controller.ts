import authenticated from '@/middleware/authenticated.middleware';
import UserService from '@/resources/user/user.service';
import validate from '@/resources/user/user.validation';
import logMiddleware from '@/root/functions/logMiddleware';
import validationMiddleware from '@/root/middleware/validation.middleware';
import HttpException from '@/root/utils/exceptions/http.exceptions';
import Controller from '@/root/utils/interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';

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

    this.router.post('/users/subscribe', this.subscribeUserToEmail);

    this.router.get('/users/getData/:id', authenticated, this.getUser);
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

      if (!isEmailUnique) {
        next(new HttpException(409, 'ایمیل وارد شده تکراری است'));
      }
      logMiddleware('isEmailUnique');
      return next();
    } catch (error) {
      next(new HttpException(401, 'unable to login user'));
    }
  };

  private subscribeUserToEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      let { email, name } = req.body;

      const user = await this.UserService.subscribeUser(email, name);

      logMiddleware('subscribeUserToEmail');
      res.send(user);
    } catch (error) {
      console.log(error);
      next(new HttpException(401, 'unable to login user'));
    }
  };
}

export default UserController;
