import UserModel from '@/resources/user/user.model';
import emailConfig from '@/root/emailConfig';
import token from '@/utils/token';
import axios from 'axios';
import { RegisterRequirements } from './user.customTypes';

class UserService {
  private user = UserModel;

  //  register a new user

  public async register(
    registerRequirements: RegisterRequirements
  ): Promise<string | Error> {
    try {
      const user = await this.user.create(registerRequirements);
      const accessToken = token.createToken(user);
      return accessToken;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  //  login

  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const user = await this.user.findOne({ email });
      if (!user) {
        throw new Error('unable to find User with that email address');
      }
      if (await user.isValidPassword(password)) {
        return token.createToken(user);
      } else {
        throw new Error('wrong credentials given');
      }
    } catch (error) {
      throw new Error('Unable to login user');
    }
  }

  //  checks if the email is unique

  public async isEmailUnique(email: string): Promise<boolean> {
    try {
      const user = await this.user.findOne({ email });
      if (!user) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error('Unable to login user');
    }
  }

  public async subscribeUser(email: string, name: string) {
    try {
      const resp = await axios.post(
        emailConfig.emailBaseUrl + 'api/subscribers',
        {
          email: 'example@example.com',
        },
        {
          headers: {
            Authorization: 'Bearer ' + emailConfig.emailToken,
            'Content-Type': 'application/json',
          },
        }
      );
      if (resp.status == 200) {
        return resp.data;
      }
    } catch (error) {
      console.log(error);
      throw new Error('Unable to subscribe user');
    }
  }
}

export default UserService;
