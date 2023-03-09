import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi, { SwaggerUiOptions } from 'swagger-ui-express';

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;
    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.initializeSwaggerDocumentation();
  }
  private initializeMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }
  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }
  private initializeDatabaseConnection(): void {
    const dbPath: string =
      (process.env.MONGO_PATH || '') + '/' + (process.env.MONGO_NAME || '');
    mongoose
      .connect(dbPath)
      .then(() => {
        console.log(
          `${String.fromCodePoint(0x2713)} connected to ${
            process.env.MONGO_NAME
          }`
        );
        console.log('--------------------------------');
      })
      .catch((error) => {
        console.log(error);
      });
  }
  public listen(): void {
    this.express.listen(this.port, () => {
      console.log('--------------------------------');
      console.log(
        `${String.fromCodePoint(0x2713)} App listening on port ${this.port}`
      );
    });
  }
  private initializeSwaggerDocumentation(): void {
    // const swaggerOptions: Options = {
    //     swaggerDefinition: {
    //         openapi: '3.0.0',
    //         info: {
    //             title: 'GitiKala Swagger API Documentation',
    //             description: `Welcome to gitikala swagger api documentation To use this documentation please follow these steps:
    //             <ol>
    //             <li>use agent or sales person login endpoints to get each role's token string</li>
    //             <li>copy token value (without quotation symbols) from response body</li>
    //             <li>click the authorize button placed below this text</li>
    //             <li>paste the copied token value in the value field and click authorize</li>
    //             <li>if all the steps are completed correctly you should see the unlocked lock symbol on the right of every endpoint turn into a locked one</li>
    //             </ol>
    //       <div>
    //       <h1>Loyalty Program Notes</h1>
    //       </div>
    //       <div>
    //       <h2>task</h2>
    //       <h4>
    //         tasks are the activities which gifts user gita points or extract from
    //         his/her existing gita points , some examples are : getting invite link ,
    //         creating facility , participating in poll , gifting points to charity ,
    //         converting gita points to money , ... the full list of tasks is located in
    //         loyalty program figma file in the received or spent gita points section
    //       </h4>
    //       </div>
    //       <div>
    //       <h2>task Category</h2>
    //       <h4>
    //         each task should have a task category for example : invite link , create facility , converting gita points to money , ...
    //         the full list of task categories is located in loyalty program figma file in
    //         the main page and prize lists
    //       </h4>
    //       </div>
    //       `,
    //             contact: {
    //                 name: 'SarMad BS',
    //             },
    //         },
    //         security: [
    //             {
    //                 bearerAuth: [],
    //             },
    //         ],
    //         components: {
    //             securitySchemes: {
    //                 bearerAuth: {
    //                     type: 'http',
    //                     scheme: 'bearer',
    //                     bearerFormat: 'JWT',
    //                 },
    //             },
    //         },
    //     },
    //     apis: ['./swagger/*/*.yaml'],
    // };

    // const swaggerDocs = swaggerJsDoc(swaggerOptions);

    const options = {
      failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      apis: ['./src/resources/*/*.yaml'],
    };

    let swaggerConfiguration: SwaggerUiOptions = {
      //   customCss: `body {
      //           margin: 0;
      //           background: #4a5c66;
      //          }
      //          .swagger-ui .opblock-tag {
      //             color: #f1f1f1;
      //         }
      //         .swagger-ui .info .title {
      //             color: #f1f1f1;
      //         }
      //         .swagger-ui .opblock .opblock-summary-operation-id, .swagger-ui .opblock .opblock-summary-path, .swagger-ui .opblock .opblock-summary-path__deprecated {
      //             color: #f1f1f1;
      //             font-size: 16px;
      //         }
      //         .swagger-ui .scheme-container {
      //             background: #4a5c66;
      //         }
      //         .swagger-ui input[type=email], .swagger-ui input[type=file], .swagger-ui input[type=password], .swagger-ui input[type=search], .swagger-ui input[type=text], .swagger-ui textarea {
      //             background: #4a5c66;
      //             color:white
      //         }
      //         .swagger-ui input[type=email], .swagger-ui input[type=file], .swagger-ui input[type=password], .swagger-ui input[type=search], .swagger-ui input[type=text]::placeholder, .swagger-ui textarea {
      //             color:white
      //         }`,
      //   customCssUrl: '/src/swaggerCss.css',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showExtension: true,
        tagsSorter: 'alpha',
        operationsSorter: 'method',
        tryItOutEnabled: true,
        persistAuthorization: true,
      },
    };

    const openapiSpecification = swaggerJsDoc(options);

    this.express.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(openapiSpecification, swaggerConfiguration)
    );
  }
}

export default App;
